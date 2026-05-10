using AlumniSmartArchive.Backend.Data;
using AlumniSmartArchive.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlumniSmartArchive.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LogsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/logs
        [HttpGet]
        public async Task<IActionResult> GetAllLogs()
        {
            var logs = await _context.LogAktivitas
                .OrderByDescending(l => l.Waktu)
                .Take(50) // Ambil 50 log terbaru
                .Select(l => new {
                    l.Id,
                    l.NamaPengguna,
                    l.Aksi,
                    l.TargetObjek,
                    l.Status,
                    l.IpAddress,
                    l.Waktu
                })
                .ToListAsync();

            return Ok(logs);
        }

        // POST: api/logs
        [HttpPost]
        public async Task<IActionResult> CreateLog([FromBody] LogRequest request)
        {
            var log = new LogAktivitas
            {
                NamaPengguna = request.NamaPengguna,
                Aksi = request.Aksi,
                TargetObjek = request.TargetObjek,
                Status = request.Status ?? "Sukses",
                IpAddress = request.IpAddress ?? "127.0.0.1",
                Waktu = DateTime.UtcNow
            };

            // Optional: resolve PenggunaId if matching user found
            var user = await _context.Users.FirstOrDefaultAsync(u => u.FullName == request.NamaPengguna || u.Username == request.NamaPengguna);
            if (user != null)
            {
                log.PenggunaId = user.Id;
            }

            _context.LogAktivitas.Add(log);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Log dicatat" });
        }

        // DELETE: api/logs
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearAllLogs()
        {
            _context.LogAktivitas.RemoveRange(_context.LogAktivitas);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Semua log berhasil dihapus" });
        }
    }

    public class LogRequest
    {
        public string NamaPengguna { get; set; } = string.Empty;
        public string Aksi { get; set; } = string.Empty;
        public string TargetObjek { get; set; } = string.Empty;
        public string? Status { get; set; }
        public string? IpAddress { get; set; }
    }
}
