using AlumniSmartArchive.Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace AlumniSmartArchive.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous] // Mengizinkan eksekusi seed tanpa token jika diperlukan
    public class SeedController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SeedController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("30")]
        [HttpGet("30")]
        public async Task<IActionResult> Seed30Arsip()
        {
            await DbSeeder.Seed30DataPerArsipAsync(_context);

            var summary = new
            {
                totalAlumni = await _context.Alumni.CountAsync(),
                totalBukuInduk = await _context.BukuInduks.CountAsync(),
                totalDetailIjazah = await _context.DetailIjazahs.CountAsync(),
                totalDetailSkl = await _context.DetailSkls.CountAsync(),
                totalArsipIjazah = await _context.Archives.CountAsync(a => a.JenisArsip == "Ijazah"),
                totalArsipSkl = await _context.Archives.CountAsync(a => a.JenisArsip == "SKL"),
                totalArsipRapor = await _context.Archives.CountAsync(a => a.JenisArsip == "Rapor"),
                totalArsipBukuInduk = await _context.Archives.CountAsync(a => a.JenisArsip == "Buku Induk"),
                totalArsipTranskrip = await _context.Archives.CountAsync(a => a.JenisArsip == "Transkrip"),
                totalHasilOcr = await _context.OcrResults.CountAsync()
            };

            return Ok(new
            {
                success = true,
                message = "Berhasil menambahkan dan memastikan minimal 30 data untuk masing-masing kategori arsip ke database!",
                data = summary
            });
        }
    }
}
