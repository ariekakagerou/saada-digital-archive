using AlumniSmartArchive.Backend.Data;
using AlumniSmartArchive.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlumniSmartArchive.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OcrController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OcrController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ocr/archive/5
        [HttpGet("archive/{archiveId}")]
        public async Task<IActionResult> GetByArchiveId(int archiveId)
        {
            var ocr = await _context.OcrResults.FirstOrDefaultAsync(o => o.ArchiveId == archiveId);
            if (ocr == null) return NotFound(new { message = "Hasil OCR tidak ditemukan" });

            return Ok(new { success = true, data = ocr });
        }

        // PUT: api/ocr/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOcrResult(int id, [FromBody] UpdateOcrRequest request)
        {
            var ocr = await _context.OcrResults.FindAsync(id);
            if (ocr == null) return NotFound(new { success = false, message = "Hasil OCR tidak ditemukan" });

            // Mengizinkan pengguna/petugas memperbaiki teks OCR
            ocr.ExtractedText = request.ExtractedText ?? ocr.ExtractedText;
            
            // Tandai bahwa ini sudah dikoreksi / diview oleh manusia (Human-in-the-loop)
            ocr.Status = "Ditinjau";

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Koreksi OCR berhasil disimpan", data = ocr });
        }
    }

    public class UpdateOcrRequest
    {
        public string ExtractedText { get; set; } = string.Empty;
    }
}
