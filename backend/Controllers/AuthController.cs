using AlumniSmartArchive.Backend.Data;
using AlumniSmartArchive.Backend.DTOs;
using AlumniSmartArchive.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Google.Apis.Auth;

namespace AlumniSmartArchive.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Cari user berdasarkan username atau email
            var user = await _context.Users
                .FirstOrDefaultAsync(u => (u.Username == request.Username || u.Email == request.Username) && u.Active);

            if (user == null)
                return Unauthorized(new { message = "Username atau Password salah" });

            // Verifikasi password (dengan fallback plain-text untuk data seed)
            bool isValid = false;
            if (user.PasswordHash.StartsWith("$2"))
            {
                isValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            }
            else
            {
                // Fallback untuk data seed yang belum di-hash
                isValid = request.Password == user.PasswordHash;
            }

            if (!isValid)
                return Unauthorized(new { message = "Username atau Password salah" });

            // Generate JWT Token yang nyata
            var token = GenerateJwtToken(user);

            return Ok(new LoginResponse
            {
                Token    = token,
                Role     = user.Role,
                Username = user.Username,
                FullName = user.FullName,
                Email    = user.Email,
                AlumniId = user.AlumniId
            });
        }

        // POST: api/auth/google-login
        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new List<string> { _config["Google:ClientId"] ?? "" }
                };

                var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, settings);

                // Cari user berdasarkan email Google
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == payload.Email && u.Active);

                if (user == null)
                {
                    return Unauthorized(new { message = "Akun Google Anda belum terdaftar di sistem. Silakan minta Administrator untuk mendaftarkan email Anda terlebih dahulu." });
                }

                // Generate JWT
                var token = GenerateJwtToken(user);

                return Ok(new LoginResponse
                {
                    Token = token,
                    Role = user.Role,
                    Username = user.Username,
                    FullName = user.FullName,
                    Email = user.Email,
                    AlumniId = user.AlumniId
                });
            }
            catch (InvalidJwtException)
            {
                return Unauthorized(new { message = "Token Google tidak valid" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Terjadi kesalahan sistem", detail = ex.Message });
            }
        }


        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // Cek apakah email sudah terdaftar
            var existing = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (existing != null)
                return BadRequest(new { message = "Email sudah terdaftar" });

            // Validasi panjang password minimal
            if (request.Password.Length < 6)
                return BadRequest(new { message = "Password minimal 6 karakter" });

            // Validasi Role
            string roleToAssign = "Operator";
            if (request.Role == "Admin" || request.Role == "Penulis" || request.Role == "Alumni")
            {
                roleToAssign = request.Role;
            }

            var user = new User
            {
                Username     = request.Email.Split('@')[0],
                FullName     = request.Nama,
                Email        = request.Email,
                Nip          = request.Nip,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password), // Hash password
                Role         = roleToAssign,
                Active       = true,
                DibuatPada   = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync(); // Mendapatkan user.Id

            // Buat profil pengguna otomatis agar tidak null nantinya
            var profile = new UserProfile
            {
                UserId = user.Id,
                Jabatan = roleToAssign,
                UpdatedAt = DateTime.UtcNow
            };
            _context.UserProfiles.Add(profile);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Pendaftaran berhasil", userId = user.Id });
        }

        // POST: api/auth/register-alumni
        [HttpPost("register-alumni")]
        public async Task<IActionResult> RegisterAlumni([FromBody] RegisterAlumniRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { message = "Email dan Password wajib diisi" });

            if (request.Password.Length < 6)
                return BadRequest(new { message = "Password minimal 6 karakter" });

            var existing = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existing != null)
                return BadRequest(new { message = "Email sudah terdaftar" });

            // Search matching alumni in Alumni table by NISN or Name
            Alumni? matchingAlumni = null;
            if (!string.IsNullOrWhiteSpace(request.Nisn))
            {
                matchingAlumni = await _context.Alumni.FirstOrDefaultAsync(a => a.Nisn == request.Nisn);
            }
            if (matchingAlumni == null && !string.IsNullOrWhiteSpace(request.Nama))
            {
                matchingAlumni = await _context.Alumni.FirstOrDefaultAsync(a => a.FullName.ToLower() == request.Nama.ToLower());
            }

            // If not found, create new Alumni entry
            if (matchingAlumni == null)
            {
                matchingAlumni = new Alumni
                {
                    Nisn = request.Nisn ?? string.Empty,
                    FullName = request.Nama,
                    GraduationYear = request.GraduationYear ?? DateTime.UtcNow.Year,
                    DibuatPada = DateTime.UtcNow
                };
                _context.Alumni.Add(matchingAlumni);
                await _context.SaveChangesAsync();
            }

            var user = new User
            {
                Username = request.Email.Split('@')[0],
                FullName = request.Nama,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "Alumni",
                AlumniId = matchingAlumni.Id,
                Active = true,
                DibuatPada = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var profile = new UserProfile
            {
                UserId = user.Id,
                Nisn = matchingAlumni.Nisn,
                TahunLulus = matchingAlumni.GraduationYear.ToString(),
                StatusAlumni = "Aktif",
                Jabatan = "Alumni",
                UpdatedAt = DateTime.UtcNow
            };
            _context.UserProfiles.Add(profile);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            return Ok(new LoginResponse
            {
                Token = token,
                Role = user.Role,
                Username = user.Username,
                FullName = user.FullName,
                Email = user.Email,
                AlumniId = user.AlumniId
            });
        }

        // ── Helper ──
        private string GenerateJwtToken(User user)
        {
            var key     = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _config["Jwt:Key"] ?? "SAADA_SuperSecretKey_2026_AlumniArchive_MTs_Assaadah!"));
            var creds   = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddHours(
                double.TryParse(_config["Jwt:ExpiryHours"], out var h) ? h : 8);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,   user.Username),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role,               user.Role),
                new Claim(ClaimTypes.NameIdentifier,     user.Id.ToString()),
                new Claim("fullName",                    user.FullName),
                new Claim("alumniId",                    user.AlumniId?.ToString() ?? ""),
                new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer:    _config["Jwt:Issuer"]   ?? "saada-backend",
                audience:  _config["Jwt:Audience"] ?? "saada-frontend",
                claims:    claims,
                expires:   expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // ── MIGRASI: Endpoint helper untuk generate BCrypt hash ──
        // CATATAN: Hapus endpoint ini setelah semua password sudah dimigrasi!
        [HttpPost("hash-password")]
        public IActionResult HashPassword([FromBody] HashRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Password))
                return BadRequest(new { message = "Password tidak boleh kosong" });

            var hash = BCrypt.Net.BCrypt.HashPassword(req.Password);
            return Ok(new { hash, note = "Gunakan hash ini untuk UPDATE tabel pengguna di database" });
        }

        public class HashRequest { public string Password { get; set; } = string.Empty; }
    }
}

