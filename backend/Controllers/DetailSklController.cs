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
    public class DetailSklController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DetailSklController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/detailskl
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? alumniId, [FromQuery] string? search)
        {
            var query = _context.DetailSkls
                .Include(d => d.Alumni)
                .Include(d => d.NilaiUjianSkls)
                    .ThenInclude(n => n.MataPelajaran)
                .AsQueryable();

            if (alumniId.HasValue)
                query = query.Where(d => d.AlumniId == alumniId.Value);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var q = search.ToLower();
                query = query.Where(d =>
                    (d.Alumni != null && d.Alumni.FullName.ToLower().Contains(q)) ||
                    (d.Alumni != null && d.Alumni.Nisn.Contains(q)) ||
                    d.NomorPeserta.Contains(q));
            }

            var items = await query.OrderByDescending(d => d.Id).ToListAsync();
            return Ok(items.Select(MapToResponse));
        }

        // GET: api/detailskl/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var detail = await _context.DetailSkls
                .Include(d => d.Alumni)
                .Include(d => d.NilaiUjianSkls)
                    .ThenInclude(n => n.MataPelajaran)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (detail == null)
                return NotFound(new { message = "Detail SKL tidak ditemukan" });

            return Ok(MapToResponse(detail));
        }

        // GET: api/detailskl/alumni/5
        [HttpGet("alumni/{alumniId}")]
        public async Task<IActionResult> GetByAlumni(int alumniId)
        {
            var detail = await _context.DetailSkls
                .Include(d => d.Alumni)
                .Include(d => d.NilaiUjianSkls)
                    .ThenInclude(n => n.MataPelajaran)
                .FirstOrDefaultAsync(d => d.AlumniId == alumniId);

            if (detail == null)
                return Ok(null); // Not an error - just not created yet

            return Ok(MapToResponse(detail));
        }

        // POST: api/detailskl
        [HttpPost]
        [Authorize(Roles = "AdminSuper,Admin,Operator,Penulis")]
        public async Task<IActionResult> Create([FromBody] CreateDetailSklRequest request)
        {
            var alumni = await _context.Alumni.FindAsync(request.AlumniId);
            if (alumni == null)
                return BadRequest(new { message = "Alumni tidak ditemukan" });

            if (await _context.DetailSkls.AnyAsync(d => d.AlumniId == request.AlumniId))
                return BadRequest(new { message = "Detail SKL untuk alumni ini sudah ada. Gunakan PUT untuk mengubah." });

            var detail = new DetailSkl
            {
                AlumniId = request.AlumniId,
                NomorPeserta = request.NomorPeserta,
                TanggalTerbit = request.TanggalTerbit,
                DibuatPada = DateTime.UtcNow
            };

            foreach (var nilai in request.NilaiUjian)
            {
                detail.NilaiUjianSkls.Add(new NilaiUjianSkl
                {
                    MataPelajaranId = nilai.MataPelajaranId,
                    Nilai = nilai.Nilai
                });
            }

            if (detail.NilaiUjianSkls.Count > 0)
                detail.RataRataNilai = detail.NilaiUjianSkls.Average(n => n.Nilai);

            _context.DetailSkls.Add(detail);
            await _context.SaveChangesAsync();

            var created = await _context.DetailSkls
                .Include(d => d.Alumni)
                .Include(d => d.NilaiUjianSkls).ThenInclude(n => n.MataPelajaran)
                .FirstOrDefaultAsync(d => d.Id == detail.Id);

            return CreatedAtAction(nameof(GetById), new { id = detail.Id }, MapToResponse(created!));
        }

        // PUT: api/detailskl/5
        [HttpPut("{id}")]
        [Authorize(Roles = "AdminSuper,Admin,Operator,Penulis")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateDetailSklRequest request)
        {
            var detail = await _context.DetailSkls
                .Include(d => d.NilaiUjianSkls)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (detail == null)
                return NotFound(new { message = "Detail SKL tidak ditemukan" });

            detail.NomorPeserta = request.NomorPeserta;
            detail.TanggalTerbit = request.TanggalTerbit;

            _context.NilaiUjianSkls.RemoveRange(detail.NilaiUjianSkls);
            detail.NilaiUjianSkls.Clear();

            foreach (var nilai in request.NilaiUjian)
            {
                detail.NilaiUjianSkls.Add(new NilaiUjianSkl
                {
                    DetailSklId = id,
                    MataPelajaranId = nilai.MataPelajaranId,
                    Nilai = nilai.Nilai
                });
            }

            detail.RataRataNilai = detail.NilaiUjianSkls.Count > 0
                ? detail.NilaiUjianSkls.Average(n => n.Nilai)
                : 0;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Detail SKL berhasil diperbarui" });
        }

        // DELETE: api/detailskl/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "AdminSuper,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var detail = await _context.DetailSkls
                .Include(d => d.NilaiUjianSkls)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (detail == null)
                return NotFound(new { message = "Detail SKL tidak ditemukan" });

            _context.NilaiUjianSkls.RemoveRange(detail.NilaiUjianSkls);
            _context.DetailSkls.Remove(detail);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Detail SKL berhasil dihapus" });
        }

        // GET: api/detailskl/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var total = await _context.DetailSkls.CountAsync();
            var rataRataAll = await _context.DetailSkls
                .Where(d => d.RataRataNilai > 0)
                .AverageAsync(d => (double?)d.RataRataNilai) ?? 0;

            return Ok(new { total, rataRataAll = Math.Round(rataRataAll, 2) });
        }

        // ── Helper ──
        private static DetailSklResponse MapToResponse(DetailSkl d)
        {
            return new DetailSklResponse
            {
                Id = d.Id,
                AlumniId = d.AlumniId,
                NamaAlumni = d.Alumni?.FullName ?? string.Empty,
                Nisn = d.Alumni?.Nisn ?? string.Empty,
                NomorPeserta = d.NomorPeserta,
                TanggalTerbit = d.TanggalTerbit,
                RataRataNilai = d.RataRataNilai,
                NilaiUjian = d.NilaiUjianSkls?.Select(n => new NilaiUjianSklDto
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
