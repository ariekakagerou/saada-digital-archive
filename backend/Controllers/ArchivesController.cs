using AlumniSmartArchive.Backend.Data;
using AlumniSmartArchive.Backend.DTOs;
using AlumniSmartArchive.Backend.Models;
using AlumniSmartArchive.Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlumniSmartArchive.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArchivesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAiService _aiService;
        private readonly IWebHostEnvironment _env;

        public ArchivesController(AppDbContext context, IAiService aiService, IWebHostEnvironment env)
        {
            _context = context;
            _aiService = aiService;
            _env = env;
        }

        // GET: api/archives?jenis=Ijazah
        [HttpGet]
        public async Task<IActionResult> GetArchives([FromQuery] string? jenis)
        {
            var query = _context.Archives
                .Include(a => a.OcrResult)
                .AsQueryable();

            if (!string.IsNullOrEmpty(jenis))
            {
                query = query.Where(a => a.JenisArsip == jenis);
            }

            var results = await query
                .OrderByDescending(a => a.UploadedAt)
                .ToListAsync();

            return Ok(results.Select(a => new {
                id = a.Id,
                alumniId = a.AlumniId,
                filePath = a.FilePath,
                fileType = a.FileType,
                jenisArsip = a.JenisArsip,
                statusArsip = a.StatusArsip,
                uploadedAt = a.UploadedAt,
                confidence = a.OcrResult?.ConfidenceScore ?? 0
            }));
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadArchive([FromForm] UploadRequest request)
        {
            if (request.File == null || request.File.Length == 0)
                return BadRequest("File tidak boleh kosong");

            // 1. Save File Locally
            var uploadsFolder = Path.Combine(_env.ContentRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(request.File.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await request.File.CopyToAsync(stream);
            }

            // 2. Process OCR (AI Service)
            OcrResponse? ocrData = null;
            using (var stream = request.File.OpenReadStream())
            {
                ocrData = await _aiService.ProcessOcrAsync(stream, request.File.FileName);
            }

            // 3. Save to Database
            var archive = new Archive
            {
                FilePath = fileName,
                FileType = Path.GetExtension(fileName).TrimStart('.').ToUpper(),
                JenisArsip = request.JenisArsip,
                UploadedAt = DateTime.UtcNow
            };

            if (ocrData != null)
            {
                archive.OcrResult = new OcrResult
                {
                    ExtractedText = ocrData.Text,
                    ConfidenceScore = ocrData.Confidence,
                    Status = "Selesai"
                };
            }

            _context.Archives.Add(archive);
            await _context.SaveChangesAsync();

            // 4. Log Activity
            await LogActivity("Unggah Arsip", $"Mengunggah {request.JenisArsip}: {fileName}", "Sukses");

            return Ok(new 
            { 
                message = "Berhasil diunggah dan diproses", 
                data = new { archive.Id, archive.FilePath, archive.JenisArsip, archive.FileType },
                ocr = ocrData,
                smartAnalysis = new {
                    suggestedCategory = ocrData?.SuggestedCategory,
                    isMatch = ocrData?.SuggestedCategory == request.JenisArsip,
                    llmCleaned = ocrData?.LlmCleanedData
                }
            });
        }

        [HttpPost("evaluate")]
        public async Task<IActionResult> EvaluateOcr([FromForm] UploadRequest request)
        {
            if (request.File == null || request.File.Length == 0)
                return BadRequest("File tidak boleh kosong");

            using (var stream = request.File.OpenReadStream())
            {
                var comparisonData = await _aiService.ProcessOcrCompareAsync(stream, request.File.FileName);
                
                if (comparisonData == null)
                    return StatusCode(500, "Gagal memproses evaluasi OCR");

                await LogActivity("Evaluasi OCR", $"Melakukan perbandingan OCR pada file: {request.File.FileName}", "Sukses");

                return Ok(new
                {
                    success = true,
                    message = "Evaluasi komparatif berhasil",
                    data = comparisonData
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetArchive(int id)
        {
            var archive = await _context.Archives
                .Include(a => a.OcrResult)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (archive == null)
                return NotFound(new { message = "Arsip tidak ditemukan" });

            return Ok(new
            {
                id = archive.Id,
                alumniId = archive.AlumniId,
                filePath = archive.FilePath,
                fileType = archive.FileType,
                jenisArsip = archive.JenisArsip,
                statusArsip = archive.StatusArsip,
                uploadedAt = archive.UploadedAt,
                ocr = archive.OcrResult == null ? null : new
                {
                    extractedText = archive.OcrResult.ExtractedText,
                    confidenceScore = archive.OcrResult.ConfidenceScore,
                    status = archive.OcrResult.Status
                }
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArchive(int id)
        {
            var archive = await _context.Archives.FindAsync(id);
            if (archive == null) return NotFound(new { message = "Arsip tidak ditemukan" });

            // 1. Hapus file fisik dengan aman
            var uploadsFolder = Path.Combine(_env.ContentRootPath, "uploads");
            var filePath = Path.Combine(uploadsFolder, archive.FilePath);

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            // 2. Hapus OcrResult terkait (jika belum cascade delete)
            var ocr = await _context.OcrResults.FirstOrDefaultAsync(o => o.ArchiveId == id);
            if (ocr != null) 
            {
                _context.OcrResults.Remove(ocr);
            }

            // 3. Hapus Arsip dari DB
            _context.Archives.Remove(archive);
            await _context.SaveChangesAsync();

            await LogActivity("Hapus Arsip", $"Menghapus arsip ID: {id}", "Sukses");

            return Ok(new { message = "Arsip fisik dan data berhasil dihapus permanen" });
        }

        private async Task LogActivity(string aksi, string target, string status)
        {
            try
            {
                var log = new LogAktivitas
                {
                    Aksi = aksi,
                    TargetObjek = target,
                    Status = status,
                    NamaPengguna = User.Identity?.Name ?? "Sistem",
                    IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1",
                    Waktu = DateTime.UtcNow
                };
                _context.LogAktivitas.Add(log);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Gagal mencatat log: {ex.Message}");
            }
        }
    }
}
