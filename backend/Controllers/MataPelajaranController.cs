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
    public class MataPelajaranController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MataPelajaranController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/matapelajaran
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? kategori)
        {
            var query = _context.MataPelajarans.AsQueryable();

            if (!string.IsNullOrWhiteSpace(kategori) && kategori != "Semua")
                query = query.Where(m => m.Kategori == kategori);

            var list = await query.OrderBy(m => m.Kategori).ThenBy(m => m.NamaMapel).ToListAsync();

            var response = list.Select(m => new MataPelajaranDto
            {
                Id = m.Id,
                KodeMapel = m.KodeMapel,
                NamaMapel = m.NamaMapel,
                Kategori = m.Kategori
            });

            return Ok(response);
        }

        // GET: api/matapelajaran/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var m = await _context.MataPelajarans.FindAsync(id);
            if (m == null)
                return NotFound(new { message = "Mata pelajaran tidak ditemukan" });

            return Ok(new MataPelajaranDto
            {
                Id = m.Id,
                KodeMapel = m.KodeMapel,
                NamaMapel = m.NamaMapel,
                Kategori = m.Kategori
            });
        }

        // POST: api/matapelajaran
        [HttpPost]
        [Authorize(Roles = "AdminSuper,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateMataPelajaranRequest request)
        {
            if (await _context.MataPelajarans.AnyAsync(m => m.KodeMapel == request.KodeMapel))
                return BadRequest(new { message = "Kode mata pelajaran sudah ada" });

            var mapel = new MataPelajaran
            {
                KodeMapel = request.KodeMapel,
                NamaMapel = request.NamaMapel,
                Kategori = request.Kategori,
                DibuatPada = DateTime.UtcNow
            };

            _context.MataPelajarans.Add(mapel);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = mapel.Id }, new MataPelajaranDto
            {
                Id = mapel.Id,
                KodeMapel = mapel.KodeMapel,
                NamaMapel = mapel.NamaMapel,
                Kategori = mapel.Kategori
            });
        }

        // PUT: api/matapelajaran/5
        [HttpPut("{id}")]
        [Authorize(Roles = "AdminSuper,Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateMataPelajaranRequest request)
        {
            var mapel = await _context.MataPelajarans.FindAsync(id);
            if (mapel == null)
                return NotFound(new { message = "Mata pelajaran tidak ditemukan" });

            mapel.KodeMapel = request.KodeMapel;
            mapel.NamaMapel = request.NamaMapel;
            mapel.Kategori = request.Kategori;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Mata pelajaran berhasil diperbarui" });
        }

        // DELETE: api/matapelajaran/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "AdminSuper,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var mapel = await _context.MataPelajarans.FindAsync(id);
            if (mapel == null)
                return NotFound(new { message = "Mata pelajaran tidak ditemukan" });

            _context.MataPelajarans.Remove(mapel);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Mata pelajaran berhasil dihapus" });
        }
    }
}
