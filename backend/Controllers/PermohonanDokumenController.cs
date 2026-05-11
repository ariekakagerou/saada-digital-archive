using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AlumniSmartArchive.Backend.Data;
using AlumniSmartArchive.Backend.Models;

namespace AlumniSmartArchive.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PermohonanDokumenController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PermohonanDokumenController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.PermohonanDokumens.Include(p => p.Alumni).OrderByDescending(p => p.TanggalPengajuan).ToListAsync();
            return Ok(new { success = true, data });
        }

        [HttpGet("alumni/{alumniId}")]
        public async Task<IActionResult> GetByAlumniId(int alumniId)
        {
            var data = await _context.PermohonanDokumens.Where(p => p.AlumniId == alumniId).OrderByDescending(p => p.TanggalPengajuan).ToListAsync();
            return Ok(new { success = true, data });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PermohonanDokumen permohonan)
        {
            permohonan.TanggalPengajuan = DateTime.UtcNow;
            permohonan.StatusPermohonan = "Menunggu";
            _context.PermohonanDokumens.Add(permohonan);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, data = permohonan });
        }

        public class UpdateStatusRequest { public string Status { get; set; } = string.Empty; }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            var permohonan = await _context.PermohonanDokumens.FindAsync(id);
            if (permohonan == null) return NotFound(new { success = false, message = "Data tidak ditemukan" });

            permohonan.StatusPermohonan = request.Status;
            if (request.Status == "Selesai" || request.Status == "Ditolak") 
            {
                permohonan.TanggalSelesai = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true, data = permohonan });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var permohonan = await _context.PermohonanDokumens.FindAsync(id);
            if (permohonan == null) return NotFound(new { success = false, message = "Data tidak ditemukan" });

            _context.PermohonanDokumens.Remove(permohonan);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Berhasil dihapus" });
        }
    }
}
