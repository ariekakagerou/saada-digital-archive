using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AlumniSmartArchive.Backend.Data;
using AlumniSmartArchive.Backend.Models;

namespace AlumniSmartArchive.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KategoriArsipController : ControllerBase
    {
        private readonly AppDbContext _context;

        public KategoriArsipController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.KategoriArsips.OrderBy(k => k.Id).ToListAsync();
            return Ok(new { success = true, data });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] KategoriArsip kategori)
        {
            kategori.DibuatPada = DateTime.UtcNow;
            _context.KategoriArsips.Add(kategori);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, data = kategori });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var kategori = await _context.KategoriArsips.FindAsync(id);
            if (kategori == null) return NotFound(new { success = false, message = "Kategori tidak ditemukan" });

            _context.KategoriArsips.Remove(kategori);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Berhasil dihapus" });
        }
    }
}
