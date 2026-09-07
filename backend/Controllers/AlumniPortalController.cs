using System.Security.Claims;
using AlumniSmartArchive.Backend.Data;
using AlumniSmartArchive.Backend.DTOs;
using AlumniSmartArchive.Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlumniSmartArchive.Backend.Controllers
{
    [ApiController]
    [Route("api/alumni-portal")]
    [Authorize]
    public class AlumniPortalController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AlumniPortalController(AppDbContext context)
        {
            _context = context;
        }

        private async Task<(User? user, int? alumniId)> GetCurrentUserAndAlumniIdAsync()
        {
            // 1. Coba cari via berbagai claim NameIdentifier / nameid / sub
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
                              ?? User.FindFirst("nameid")?.Value
                              ?? User.FindFirst("id")?.Value
                              ?? User.FindFirst(ClaimTypes.PrimarySid)?.Value;

            User? user = null;
            if (!string.IsNullOrEmpty(userIdClaim) && int.TryParse(userIdClaim, out int userId))
            {
                user = await _context.Users
                    .Include(u => u.Profile)
                    .FirstOrDefaultAsync(u => u.Id == userId);
            }

            // 2. Fallback via username atau email claim
            if (user == null)
            {
                var username = User.FindFirstValue(ClaimTypes.Name)
                               ?? User.FindFirst("sub")?.Value
                               ?? User.FindFirst("unique_name")?.Value
                               ?? User.Identity?.Name;

                var email = User.FindFirstValue(ClaimTypes.Email)
                            ?? User.FindFirst("email")?.Value;

                if (!string.IsNullOrEmpty(username))
                {
                    user = await _context.Users
                        .Include(u => u.Profile)
                        .FirstOrDefaultAsync(u => u.Username == username);
                }
                else if (!string.IsNullOrEmpty(email))
                {
                    user = await _context.Users
                        .Include(u => u.Profile)
                        .FirstOrDefaultAsync(u => u.Email == email);
                }
            }

            // 3. Fallback jika user login sebagai Alumni
            if (user == null)
            {
                user = await _context.Users
                    .Include(u => u.Profile)
                    .FirstOrDefaultAsync(u => u.Role == "Alumni" && u.Active);
            }

            if (user == null) return (null, null);

            int? alumniId = user.AlumniId;
            if (!alumniId.HasValue && !string.IsNullOrEmpty(user.Profile?.Nisn))
            {
                var matchingAlumni = await _context.Alumni.FirstOrDefaultAsync(a => a.Nisn == user.Profile.Nisn);
                if (matchingAlumni != null) alumniId = matchingAlumni.Id;
            }
            if (!alumniId.HasValue && !string.IsNullOrEmpty(user.FullName))
            {
                var matchingAlumni = await _context.Alumni.FirstOrDefaultAsync(a => a.FullName.ToLower() == user.FullName.ToLower());
                if (matchingAlumni != null) alumniId = matchingAlumni.Id;
            }

            return (user, alumniId);
        }

        // GET: api/alumni-portal/me
        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var (user, alumniId) = await GetCurrentUserAndAlumniIdAsync();
            if (user == null) return Unauthorized(new { message = "Pengguna tidak ditemukan" });

            Alumni? alumniData = null;
            if (alumniId.HasValue)
            {
                alumniData = await _context.Alumni.FirstOrDefaultAsync(a => a.Id == alumniId.Value);
            }

            return Ok(new
            {
                success = true,
                user = new
                {
                    user.Id,
                    user.Username,
                    user.FullName,
                    user.Email,
                    user.Role,
                    AlumniId = alumniId
                },
                profile = user.Profile,
                alumni = alumniData
            });
        }

        // GET: api/alumni-portal/dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var (user, alumniId) = await GetCurrentUserAndAlumniIdAsync();
            if (user == null) return Unauthorized(new { message = "Pengguna tidak ditemukan" });

            int totalArchives = 0;
            int totalRequests = 0;
            int pendingRequests = 0;
            bool hasTracerStudy = false;
            List<object> archivesSummary = new();

            if (alumniId.HasValue)
            {
                var archives = await _context.Archives
                    .Where(a => a.AlumniId == alumniId.Value)
                    .ToListAsync();
                
                totalArchives = archives.Count;
                archivesSummary = archives.Select(a => new
                {
                    a.Id,
                    a.JenisArsip,
                    a.FileType,
                    a.UploadedAt
                }).Cast<object>().ToList();

                var requests = await _context.PermohonanDokumens
                    .Where(p => p.AlumniId == alumniId.Value)
                    .ToListAsync();

                totalRequests = requests.Count;
                pendingRequests = requests.Count(p => p.StatusPermohonan == "Menunggu" || p.StatusPermohonan == "Diproses");

                hasTracerStudy = await _context.TracerStudies.AnyAsync(t => t.AlumniId == alumniId.Value);
            }

            return Ok(new
            {
                success = true,
                totalArchives,
                totalRequests,
                pendingRequests,
                hasTracerStudy,
                archives = archivesSummary
            });
        }

        // GET: api/alumni-portal/my-documents
        [HttpGet("my-documents")]
        public async Task<IActionResult> GetMyDocuments()
        {
            var (user, alumniId) = await GetCurrentUserAndAlumniIdAsync();
            if (!alumniId.HasValue)
            {
                return Ok(new { success = true, data = new List<object>() });
            }

            var archives = await _context.Archives
                .Include(a => a.OcrResult)
                .Where(a => a.AlumniId == alumniId.Value)
                .OrderByDescending(a => a.UploadedAt)
                .Select(a => new
                {
                    a.Id,
                    a.AlumniId,
                    a.JenisArsip,
                    a.FilePath,
                    a.FileType,
                    a.StatusArsip,
                    a.UkuranFile,
                    a.UploadedAt,
                    OcrConfidence = a.OcrResult != null ? a.OcrResult.ConfidenceScore : (double?)null
                })
                .ToListAsync();

            return Ok(new { success = true, data = archives });
        }

        // GET: api/alumni-portal/my-requests
        [HttpGet("my-requests")]
        public async Task<IActionResult> GetMyRequests()
        {
            var (user, alumniId) = await GetCurrentUserAndAlumniIdAsync();
            if (!alumniId.HasValue)
            {
                return Ok(new { success = true, data = new List<object>() });
            }

            var requests = await _context.PermohonanDokumens
                .Where(p => p.AlumniId == alumniId.Value)
                .OrderByDescending(p => p.TanggalPengajuan)
                .ToListAsync();

            return Ok(new { success = true, data = requests });
        }

        // POST: api/alumni-portal/request-document
        [HttpPost("request-document")]
        public async Task<IActionResult> CreateRequest([FromBody] CreateAlumniRequestDto dto)
        {
            var (user, alumniId) = await GetCurrentUserAndAlumniIdAsync();
            if (!alumniId.HasValue)
            {
                return BadRequest(new { success = false, message = "Akun Anda belum terhubung dengan Data Alumni sekolah." });
            }

            var permohonan = new PermohonanDokumen
            {
                AlumniId = alumniId.Value,
                JenisDokumen = dto.JenisDokumen ?? "Ijazah",
                TujuanPermohonan = dto.TujuanPermohonan ?? "Melamar Kerja",
                JumlahCopy = dto.JumlahCopy > 0 ? dto.JumlahCopy : 1,
                Keterangan = dto.Keterangan ?? string.Empty,
                StatusPermohonan = "Menunggu",
                TanggalPengajuan = DateTime.UtcNow
            };

            _context.PermohonanDokumens.Add(permohonan);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Permohonan dokumen berhasil diajukan", data = permohonan });
        }

        // GET: api/alumni-portal/my-tracer
        [HttpGet("my-tracer")]
        public async Task<IActionResult> GetMyTracer()
        {
            var (user, alumniId) = await GetCurrentUserAndAlumniIdAsync();
            if (!alumniId.HasValue)
            {
                return Ok(new { success = true, data = new List<object>() });
            }

            var tracerList = await _context.TracerStudies
                .Where(t => t.AlumniId == alumniId.Value)
                .OrderByDescending(t => t.DiperbaruiPada)
                .ToListAsync();

            return Ok(new { success = true, data = tracerList });
        }

        // POST: api/alumni-portal/my-tracer
        [HttpPost("my-tracer")]
        public async Task<IActionResult> SaveMyTracer([FromBody] TracerStudyUpdateDto dto)
        {
            var (user, alumniId) = await GetCurrentUserAndAlumniIdAsync();
            if (!alumniId.HasValue)
            {
                return BadRequest(new { success = false, message = "Akun Anda belum terhubung dengan Data Alumni sekolah." });
            }

            var tracer = await _context.TracerStudies.FirstOrDefaultAsync(t => t.AlumniId == alumniId.Value);

            if (tracer == null)
            {
                tracer = new TracerStudy
                {
                    AlumniId = alumniId.Value,
                    StatusSaatIni = dto.StatusSaatIni ?? string.Empty,
                    NamaInstansi = dto.NamaInstansi ?? string.Empty,
                    JabatanAtauJurusan = dto.JabatanAtauJurusan ?? string.Empty,
                    AlamatInstansi = dto.AlamatInstansi ?? string.Empty,
                    TahunMulai = dto.TahunMulai ?? string.Empty,
                    CatatanTambahan = dto.CatatanTambahan ?? string.Empty,
                    DiperbaruiPada = DateTime.UtcNow
                };
                _context.TracerStudies.Add(tracer);
            }
            else
            {
                tracer.StatusSaatIni = dto.StatusSaatIni ?? tracer.StatusSaatIni;
                tracer.NamaInstansi = dto.NamaInstansi ?? tracer.NamaInstansi;
                tracer.JabatanAtauJurusan = dto.JabatanAtauJurusan ?? tracer.JabatanAtauJurusan;
                tracer.AlamatInstansi = dto.AlamatInstansi ?? tracer.AlamatInstansi;
                tracer.TahunMulai = dto.TahunMulai ?? tracer.TahunMulai;
                tracer.CatatanTambahan = dto.CatatanTambahan ?? tracer.CatatanTambahan;
                tracer.DiperbaruiPada = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Data Tracer Study berhasil disimpan", data = tracer });
        }
    }

    public class CreateAlumniRequestDto
    {
        public string? JenisDokumen { get; set; }
        public string? TujuanPermohonan { get; set; }
        public int JumlahCopy { get; set; } = 1;
        public string? Keterangan { get; set; }
    }
}
