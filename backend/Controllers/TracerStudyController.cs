using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AlumniSmartArchive.Backend.Data;
using AlumniSmartArchive.Backend.Models;

namespace AlumniSmartArchive.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TracerStudyController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TracerStudyController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.TracerStudies
                .Include(t => t.Alumni)
                .OrderByDescending(t => t.DiperbaruiPada)
                .Select(t => new {
                    t.Id,
                    t.AlumniId,
                    t.StatusSaatIni,
                    t.NamaInstansi,
                    t.JabatanAtauJurusan,
                    t.AlamatInstansi,
                    t.TahunMulai,
                    t.CatatanTambahan,
                    t.DiperbaruiPada,
                    Alumni = t.Alumni == null ? null : new {
                        t.Alumni.Id,
                        t.Alumni.FullName,
                        t.Alumni.Nis,
                        t.Alumni.Nisn,
                        t.Alumni.GraduationYear
                    }
                })
                .ToListAsync();
            return Ok(new { success = true, data });
        }

        [HttpGet("alumni/{alumniId}")]
        public async Task<IActionResult> GetByAlumniId(int alumniId)
        {
            var data = await _context.TracerStudies
                .Where(t => t.AlumniId == alumniId)
                .OrderByDescending(t => t.DiperbaruiPada)
                .Select(t => new {
                    t.Id,
                    t.AlumniId,
                    t.StatusSaatIni,
                    t.NamaInstansi,
                    t.JabatanAtauJurusan,
                    t.AlamatInstansi,
                    t.TahunMulai,
                    t.CatatanTambahan,
                    t.DiperbaruiPada
                })
                .ToListAsync();
            return Ok(new { success = true, data });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TracerStudyUpdateDto dto)
        {
            var tracer = new TracerStudy
            {
                AlumniId = dto.AlumniId,
                StatusSaatIni = dto.StatusSaatIni ?? string.Empty,
                NamaInstansi = dto.NamaInstansi ?? string.Empty,
                JabatanAtauJurusan = dto.JabatanAtauJurusan ?? string.Empty,
                AlamatInstansi = dto.AlamatInstansi ?? string.Empty,
                TahunMulai = dto.TahunMulai ?? string.Empty,
                CatatanTambahan = dto.CatatanTambahan ?? string.Empty,
                DiperbaruiPada = DateTime.UtcNow
            };
            _context.TracerStudies.Add(tracer);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, data = tracer });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TracerStudyUpdateDto dto)
        {
            var tracer = await _context.TracerStudies.FindAsync(id);
            if (tracer == null) return NotFound(new { success = false, message = "Data tidak ditemukan" });

            tracer.StatusSaatIni = dto.StatusSaatIni ?? tracer.StatusSaatIni;
            tracer.NamaInstansi = dto.NamaInstansi ?? tracer.NamaInstansi;
            tracer.JabatanAtauJurusan = dto.JabatanAtauJurusan ?? tracer.JabatanAtauJurusan;
            tracer.AlamatInstansi = dto.AlamatInstansi ?? tracer.AlamatInstansi;
            tracer.TahunMulai = dto.TahunMulai ?? tracer.TahunMulai;
            tracer.CatatanTambahan = dto.CatatanTambahan ?? tracer.CatatanTambahan;
            tracer.DiperbaruiPada = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { success = true, data = new {
                tracer.Id,
                tracer.AlumniId,
                tracer.StatusSaatIni,
                tracer.NamaInstansi,
                tracer.JabatanAtauJurusan,
                tracer.AlamatInstansi,
                tracer.TahunMulai,
                tracer.CatatanTambahan,
                tracer.DiperbaruiPada
            }});
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var tracer = await _context.TracerStudies.FindAsync(id);
            if (tracer == null) return NotFound(new { success = false, message = "Data tidak ditemukan" });

            _context.TracerStudies.Remove(tracer);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Berhasil dihapus" });
        }
    }

    /// <summary>DTO untuk Create/Update TracerStudy agar terhindar dari circular reference</summary>
    public class TracerStudyUpdateDto
    {
        public int AlumniId { get; set; }
        public string? StatusSaatIni { get; set; }
        public string? NamaInstansi { get; set; }
        public string? JabatanAtauJurusan { get; set; }
        public string? AlamatInstansi { get; set; }
        public string? TahunMulai { get; set; }
        public string? CatatanTambahan { get; set; }
    }
}
