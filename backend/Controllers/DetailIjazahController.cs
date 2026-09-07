using AlumniSmartArchive.Backend.Data;
using AlumniSmartArchive.Backend.DTOs;
using AlumniSmartArchive.Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlumniSmartArchive.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DetailIjazahController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DetailIjazahController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/detailijazah
        // Optional filter: ?alumniId=1
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? alumniId, [FromQuery] string? search)
        {
            var query = _context.DetailIjazahs
                .Include(d => d.Alumni)
                .Include(d => d.NilaiUjianIjazahs)
                    .ThenInclude(n => n.MataPelajaran)
                .AsQueryable();

            if (alumniId.HasValue)
                query = query.Where(d => d.AlumniId == alumniId.Value);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var q = search.ToLower();
                query = query.Where(d =>
                    (d.Alumni != null && d.Alumni.FullName.ToLower().Contains(q)) ||
                    (d.Alumni != null && d.Alumni.Nisn.Contains(q)));
            }

            var items = await query.OrderByDescending(d => d.Id).ToListAsync();
            return Ok(items.Select(MapToResponse));
        }

        // GET: api/detailijazah/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var detail = await _context.DetailIjazahs
                .Include(d => d.Alumni)
                .Include(d => d.NilaiUjianIjazahs)
                    .ThenInclude(n => n.MataPelajaran)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (detail == null)
                return NotFound(new { message = "Detail ijazah tidak ditemukan" });

            return Ok(MapToResponse(detail));
        }

        // GET: api/detailijazah/alumni/5
        [HttpGet("alumni/{alumniId}")]
        public async Task<IActionResult> GetByAlumni(int alumniId)
        {
            var detail = await _context.DetailIjazahs
                .Include(d => d.Alumni)
                .Include(d => d.NilaiUjianIjazahs)
                    .ThenInclude(n => n.MataPelajaran)
                .FirstOrDefaultAsync(d => d.AlumniId == alumniId);

            if (detail == null)
                return Ok(null); // Not an error - alumni just hasn't had ijazah detail created yet

            return Ok(MapToResponse(detail));
        }

        // POST: api/detailijazah
        [HttpPost]
        [Authorize(Roles = "AdminSuper,Admin,Operator,Penulis")]
        public async Task<IActionResult> Create([FromBody] CreateDetailIjazahRequest request)
        {
            // Check if alumni exists
            var alumni = await _context.Alumni.FindAsync(request.AlumniId);
            if (alumni == null)
                return BadRequest(new { message = "Alumni tidak ditemukan" });

            // Check if detail already exists for this alumni
            if (await _context.DetailIjazahs.AnyAsync(d => d.AlumniId == request.AlumniId))
                return BadRequest(new { message = "Detail ijazah untuk alumni ini sudah ada. Gunakan PUT untuk mengubah." });

            var detail = new DetailIjazah
            {
                AlumniId = request.AlumniId,
                TanggalPenerbitan = request.TanggalPenerbitan,
                NamaKepalaMadrasah = request.NamaKepalaMadrasah,
                DibuatPada = DateTime.UtcNow
            };

            // Add nilai ujian
            foreach (var nilai in request.NilaiUjian)
            {
                detail.NilaiUjianIjazahs.Add(new NilaiUjianIjazah
                {
                    MataPelajaranId = nilai.MataPelajaranId,
                    Nilai = nilai.Nilai
                });
            }

            // Compute rata-rata
            if (detail.NilaiUjianIjazahs.Count > 0)
                detail.RataRataNilai = detail.NilaiUjianIjazahs.Average(n => n.Nilai);

            _context.DetailIjazahs.Add(detail);
            await _context.SaveChangesAsync();

            // Reload with includes
            var created = await _context.DetailIjazahs
                .Include(d => d.Alumni)
                .Include(d => d.NilaiUjianIjazahs).ThenInclude(n => n.MataPelajaran)
                .FirstOrDefaultAsync(d => d.Id == detail.Id);

            return CreatedAtAction(nameof(GetById), new { id = detail.Id }, MapToResponse(created!));
        }

        // PUT: api/detailijazah/5
        [HttpPut("{id}")]
        [Authorize(Roles = "AdminSuper,Admin,Operator,Penulis")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateDetailIjazahRequest request)
        {
            var detail = await _context.DetailIjazahs
                .Include(d => d.NilaiUjianIjazahs)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (detail == null)
                return NotFound(new { message = "Detail ijazah tidak ditemukan" });

            detail.TanggalPenerbitan = request.TanggalPenerbitan;
            detail.NamaKepalaMadrasah = request.NamaKepalaMadrasah;

            // Replace nilai ujian
            _context.NilaiUjianIjazahs.RemoveRange(detail.NilaiUjianIjazahs);
            detail.NilaiUjianIjazahs.Clear();

            foreach (var nilai in request.NilaiUjian)
            {
                detail.NilaiUjianIjazahs.Add(new NilaiUjianIjazah
                {
                    DetailIjazahId = id,
                    MataPelajaranId = nilai.MataPelajaranId,
                    Nilai = nilai.Nilai
                });
            }

            // Recompute rata-rata
            detail.RataRataNilai = detail.NilaiUjianIjazahs.Count > 0
                ? detail.NilaiUjianIjazahs.Average(n => n.Nilai)
                : 0;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Detail ijazah berhasil diperbarui" });
        }

        // DELETE: api/detailijazah/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "AdminSuper,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var detail = await _context.DetailIjazahs
                .Include(d => d.NilaiUjianIjazahs)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (detail == null)
                return NotFound(new { message = "Detail ijazah tidak ditemukan" });

            _context.NilaiUjianIjazahs.RemoveRange(detail.NilaiUjianIjazahs);
            _context.DetailIjazahs.Remove(detail);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Detail ijazah berhasil dihapus" });
        }

        // GET: api/detailijazah/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var total = await _context.DetailIjazahs.CountAsync();
            var rataRataAll = await _context.DetailIjazahs
                .Where(d => d.RataRataNilai > 0)
                .AverageAsync(d => (double?)d.RataRataNilai) ?? 0;

            return Ok(new { total, rataRataAll = Math.Round(rataRataAll, 2) });
        }

        // ── Helper ──
        private static DetailIjazahResponse MapToResponse(DetailIjazah d)
        {
            return new DetailIjazahResponse
            {
                Id = d.Id,
                AlumniId = d.AlumniId,
                NamaAlumni = d.Alumni?.FullName ?? string.Empty,
                Nisn = d.Alumni?.Nisn ?? string.Empty,
                TanggalPenerbitan = d.TanggalPenerbitan,
                NamaKepalaMadrasah = d.NamaKepalaMadrasah,
                RataRataNilai = d.RataRataNilai,
                NilaiUjian = d.NilaiUjianIjazahs?.Select(n => new NilaiUjianIjazahDto
                {
                    Id = n.Id,
                    MataPelajaranId = n.MataPelajaranId,
                    NamaMapel = n.MataPelajaran?.NamaMapel ?? string.Empty,
                    KodeMapel = n.MataPelajaran?.KodeMapel ?? string.Empty,
                    Kategori = n.MataPelajaran?.Kategori ?? string.Empty,
                    Nilai = n.Nilai
                }).ToList() ?? new(),
                DibuatPada = d.DibuatPada
            };
        }
    }
}
