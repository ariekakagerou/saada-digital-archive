using AlumniSmartArchive.Backend.Data;
using AlumniSmartArchive.Backend.DTOs;
using AlumniSmartArchive.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlumniSmartArchive.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username && u.PasswordHash == request.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Username atau Password salah" });
            }

            return Ok(new LoginResponse
            {
                Token = "dummy-jwt-token-" + Guid.NewGuid(),
                Role = user.Role,
                Username = user.Username,
                FullName = user.FullName,
                Email = user.Email
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // Check if username/email already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (existingUser != null)
            {
                return BadRequest(new { message = "Email sudah terdaftar" });
            }

            var user = new User
            {
                Username = request.Email.Split('@')[0], // Use email prefix as username
                FullName = request.Nama,
                Email = request.Email,
                Nip = request.Nip,
                PasswordHash = request.Password, // Prototype: plain text
                Role = "Operator", // Default role for new registrations
                Active = true,
                DibuatPada = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Pendaftaran berhasil", userId = user.Id });
        }
    }
}
