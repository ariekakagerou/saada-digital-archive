using AlumniSmartArchive.Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlumniSmartArchive.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalBukuInduk = await _context.BukuInduks.CountAsync();
            var totalAlumni = await _context.Alumni.CountAsync();
            var totalArsip = await _context.Archives.CountAsync();
            var totalPetugas = await _context.Users.CountAsync();

            var ijazahCount = await _context.Archives.CountAsync(a => a.JenisArsip == "Ijazah");
            var skhuCount = await _context.Archives.CountAsync(a => a.JenisArsip == "SKHU" || a.JenisArsip == "SKL" || a.JenisArsip == "SKL (Surat Keterangan Lulus)" || a.JenisArsip == "SKHUN");
            var raporCount = await _context.Archives.CountAsync(a => a.JenisArsip == "Rapor");
            var transkripCount = await _context.Archives.CountAsync(a => a.JenisArsip == "Transkrip" || a.JenisArsip == "Transkrip Nilai");
            var bukuIndukDocCount = await _context.Archives.CountAsync(a => a.JenisArsip == "Buku Induk");
            
            var arsipBurukCount = await _context.Archives.CountAsync(a => a.StatusArsip == "Belum Lengkap" || a.StatusArsip == "Arsip Hilang");
            var ocrCount = await _context.OcrResults.CountAsync();

            // Progress totals per tahun based on Alumni GraduationYear
            var listTahun = new[] { 2024, 2023, 2022, 2021, 2020 };
            var progressPerTahun = await _context.Alumni
                  .Where(a => listTahun.Contains(a.GraduationYear))
                  .GroupBy(a => a.GraduationYear)
                  .Select(g => new { Year = g.Key.ToString(), Count = g.Count() })
                  .ToListAsync();

            // Upload terakhir untuk referensi
            var recentUploads = await _context.Archives
                .OrderByDescending(a => a.UploadedAt)
                .Take(5)
                .Select(a => new { a.Id, a.JenisArsip, a.UploadedAt })
                .ToListAsync();

            return Ok(new
            {
                totalBukuInduk,
                totalAlumni,
                totalArsip,
                totalPetugas,
                ijazahCount,
                skhuCount,
                raporCount,
                transkripCount,
                bukuIndukDocCount,
                arsipBurukCount,
                ocrCount,
                progressPerTahun,
                recentUploads
            });
        }
    }
}
