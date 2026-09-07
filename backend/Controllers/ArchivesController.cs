using AlumniSmartArchive.Backend.Data;
using AlumniSmartArchive.Backend.DTOs;
using AlumniSmartArchive.Backend.Models;
using AlumniSmartArchive.Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlumniSmartArchive.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Hanya user yang sudah login yang bisa akses
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
                .Include(a => a.Alumni)
                .AsQueryable();

            if (!string.IsNullOrEmpty(jenis))
            {
                if (jenis == "SKL" || jenis == "SKL (Surat Keterangan Lulus)" || jenis == "SKHU" || jenis == "SKHUN")
                {
                    query = query.Where(a => a.JenisArsip == "SKL" || a.JenisArsip == "SKL (Surat Keterangan Lulus)" || a.JenisArsip == "SKHU" || a.JenisArsip == "SKHUN");
                }
                else if (jenis == "Transkrip" || jenis == "Transkrip Nilai")
                {
                    query = query.Where(a => a.JenisArsip == "Transkrip" || a.JenisArsip == "Transkrip Nilai");
                }
                else
                {
                    query = query.Where(a => a.JenisArsip == jenis);
                }
            }

            var results = await query
                .OrderByDescending(a => a.UploadedAt)
                .ToListAsync();

            return Ok(results.Select(a => {
                string name = "Siswa Tidak Diketahui";
                string nisn = string.Empty;
                string tahunLulus = string.Empty;

                if (a.Alumni != null)
                {
                    name = a.Alumni.FullName;
                    nisn = a.Alumni.Nisn;
                    tahunLulus = a.Alumni.GraduationYear.ToString();
                }
                else if (a.OcrResult != null && !string.IsNullOrEmpty(a.OcrResult.ExtractedText))
                {
                    var parsed = ParseExtractedFields(a.OcrResult.ExtractedText);
                    if (parsed.TryGetValue("namaLengkap", out var pName)) name = pName?.ToString() ?? "Siswa Tidak Diketahui";
                    if (parsed.TryGetValue("nisn", out var pNisn)) nisn = pNisn?.ToString() ?? string.Empty;
                    if (parsed.TryGetValue("tahunLulus", out var pTahun)) tahunLulus = pTahun?.ToString() ?? string.Empty;
                }

                return new {
                    id = a.Id,
                    alumniId = a.AlumniId,
                    filePath = a.FilePath,
                    fileName = a.FilePath,
                    fileType = a.FileType,
                    jenisArsip = a.JenisArsip,
                    statusArsip = a.StatusArsip,
                    uploadedAt = a.UploadedAt,
                    uploadDate = a.UploadedAt,
                    confidence = a.OcrResult?.ConfidenceScore ?? 0,
                    siswaName = name,
                    nisn = nisn,
                    tahunLulus = tahunLulus,
                    statusOCR = a.OcrResult != null ? (a.OcrResult.Status == "Selesai" || a.OcrResult.Status == "Ditinjau" ? "Done" : a.OcrResult.Status == "Gagal" ? "Failed" : "Processing") : "Done"
                };
            }));
        }

        [HttpPost("upload")]
        [Authorize(Roles = "AdminSuper,Admin,Operator")]
        public async Task<IActionResult> UploadArchive([FromForm] UploadRequest request)
        {
            // ... (logika tetap sama)
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
                await TryLinkAlumni(archive, ocrData);
            }

            _context.Archives.Add(archive);
            await _context.SaveChangesAsync();

            // 4. Log Activity
            await LogActivity("Unggah Arsip", $"Mengunggah {request.JenisArsip}: {fileName}", "Sukses");

            return Ok(new 
            { 
                message = "Berhasil diunggah dan diproses", 
                data = new { archive.Id, archive.FilePath, archive.JenisArsip, archive.FileType },
                ocr = ocrData == null ? null : new
                {
                    id = archive.OcrResult?.Id,
                    extractedText = ocrData.Text,
                    confidenceScore = ocrData.Confidence,
                    extractedData = ocrData.ExtractedData,
                    status = "Selesai"
                },
                smartAnalysis = new {
                    suggestedCategory = ocrData?.SuggestedCategory,
                    isMatch = ocrData?.SuggestedCategory == request.JenisArsip,
                    llmCleaned = ocrData?.LlmCleanedData
                }
            });
        }

        [HttpPost("evaluate")]
        [Authorize(Roles = "AdminSuper,Admin,Operator")]
        public async Task<IActionResult> EvaluateOcr([FromForm] UploadRequest request)
        {
            // ... (logika tetap sama)
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
                .Include(a => a.Alumni)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (archive == null)
                return NotFound(new { message = "Arsip tidak ditemukan" });

            string name = "Siswa Tidak Diketahui";
            string nisn = string.Empty;
            string nis = string.Empty;
            string tahunLulus = string.Empty;
            Dictionary<string, object> parsedFields = new Dictionary<string, object>();

            if (archive.Alumni != null)
            {
                name = archive.Alumni.FullName;
                nisn = archive.Alumni.Nisn;
                nis = archive.Alumni.Nis;
                tahunLulus = archive.Alumni.GraduationYear.ToString();
            }
            else if (archive.OcrResult != null && !string.IsNullOrEmpty(archive.OcrResult.ExtractedText))
            {
                parsedFields = ParseExtractedFields(archive.OcrResult.ExtractedText);
                if (parsedFields.TryGetValue("namaLengkap", out var pName)) name = pName?.ToString() ?? "Siswa Tidak Diketahui";
                if (parsedFields.TryGetValue("nisn", out var pNisn)) nisn = pNisn?.ToString() ?? string.Empty;
                if (parsedFields.TryGetValue("nis", out var pNis)) nis = pNis?.ToString() ?? string.Empty;
                if (parsedFields.TryGetValue("tahunLulus", out var pTahun)) tahunLulus = pTahun?.ToString() ?? string.Empty;
            }

            return Ok(new
            {
                id = archive.Id,
                alumniId = archive.AlumniId,
                filePath = archive.FilePath,
                fileType = archive.FileType,
                jenisArsip = archive.JenisArsip,
                statusArsip = archive.StatusArsip,
                uploadedAt = archive.UploadedAt,
                siswaName = name,
                nisn = nisn,
                nis = nis,
                tahunLulus = tahunLulus,
                ocr = archive.OcrResult == null ? null : new
                {
                    id = archive.OcrResult.Id,
                    extractedText = archive.OcrResult.ExtractedText,
                    confidenceScore = archive.OcrResult.ConfidenceScore,
                    extractedData = parsedFields,
                    status = archive.OcrResult.Status
                }
            });
        }

        // POST: api/archives/{id}/rescan
        [HttpPost("{id}/rescan")]
        [Authorize(Roles = "AdminSuper,Admin,Operator")]
        public async Task<IActionResult> RescanArchive(int id)
        {
            var archive = await _context.Archives
                .Include(a => a.OcrResult)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (archive == null)
                return NotFound(new { message = "Arsip tidak ditemukan" });

            var uploadsFolder = Path.Combine(_env.ContentRootPath, "uploads");
            var filePath = Path.Combine(uploadsFolder, archive.FilePath);

            if (!System.IO.File.Exists(filePath))
                return NotFound(new { message = "File fisik tidak ditemukan di server" });

            // Re-process OCR
            OcrResponse? ocrData = null;
            try
            {
                using var stream = System.IO.File.OpenRead(filePath);
                ocrData = await _aiService.ProcessOcrAsync(stream, archive.FilePath);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Rescan OCR Error: {ex.Message}");
                return StatusCode(500, new { message = "Gagal memproses OCR ulang. Pastikan AI service berjalan." });
            }

            if (ocrData == null)
                return StatusCode(500, new { message = "AI Service tidak merespon. Pastikan service berjalan di port 5000." });

            // Update or create OcrResult
            try
            {
                if (archive.OcrResult == null)
                {
                    archive.OcrResult = new OcrResult
                    {
                        ExtractedText = ocrData.Text,
                        ConfidenceScore = ocrData.Confidence,
                        Status = "Selesai"
                    };
                }
                else
                {
                    archive.OcrResult.ExtractedText = ocrData.Text;
                    archive.OcrResult.ConfidenceScore = ocrData.Confidence;
                    archive.OcrResult.Status = "Selesai";
                }
                await TryLinkAlumni(archive, ocrData);

                await _context.SaveChangesAsync();
                await LogActivity("Scan Ulang Arsip", $"Memindai ulang OCR arsip ID: {id}", "Sukses");

                return Ok(new
                {
                    message = "Berhasil dipindai ulang",
                    ocr = new
                    {
                        id = archive.OcrResult.Id,
                        extractedText = ocrData.Text,
                        confidenceScore = ocrData.Confidence,
                        extractedData = ocrData.ExtractedData,
                        status = "Selesai"
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Database Save Error during Rescan: {ex.Message}");
                var innerMsg = ex.InnerException != null ? $"\nDetail: {ex.InnerException.Message}" : "";
                return StatusCode(500, new { message = $"Gagal menyimpan hasil OCR ke database: {ex.Message}{innerMsg}" });
            }
        }

        [HttpGet("file/{fileName}")]
        [AllowAnonymous]
        public IActionResult GetFile(string fileName)
        {
            var uploadsFolder = Path.Combine(_env.ContentRootPath, "uploads");
            var filePath = Path.Combine(uploadsFolder, fileName);

            if (!System.IO.File.Exists(filePath))
                return NotFound(new { message = "File tidak ditemukan" });

            var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(filePath, out var contentType))
            {
                contentType = "application/octet-stream";
            }

            return PhysicalFile(filePath, contentType);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "AdminSuper,Admin")]
        public async Task<IActionResult> DeleteArchive(int id)
        {
            // ... (logika tetap sama)
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

        private string? GetDictValueCaseInsensitive(Dictionary<string, object>? dict, string targetKey)
        {
            if (dict == null) return null;
            foreach (var kvp in dict)
            {
                if (kvp.Key.Equals(targetKey, StringComparison.OrdinalIgnoreCase))
                {
                    return kvp.Value?.ToString()?.Trim();
                }
            }
            return null;
        }

        private async Task TryLinkAlumni(Archive archive, OcrResponse? ocrData)
        {
            if (ocrData == null) return;

            string? nisn = GetDictValueCaseInsensitive(ocrData.ExtractedData, "nisn") ?? GetDictValueCaseInsensitive(ocrData.LlmCleanedData, "nisn");
            string? nis = GetDictValueCaseInsensitive(ocrData.ExtractedData, "nis") ?? GetDictValueCaseInsensitive(ocrData.LlmCleanedData, "nis");
            string? namaLengkap = GetDictValueCaseInsensitive(ocrData.ExtractedData, "namaLengkap") ?? GetDictValueCaseInsensitive(ocrData.LlmCleanedData, "namaLengkap");

            Alumni? matchingAlumni = null;

            // 1. Try matching by NISN
            if (!string.IsNullOrEmpty(nisn))
            {
                matchingAlumni = await _context.Alumni.FirstOrDefaultAsync(a => a.Nisn == nisn);
            }

            // 2. Try matching by NIS
            if (matchingAlumni == null && !string.IsNullOrEmpty(nis))
            {
                matchingAlumni = await _context.Alumni.FirstOrDefaultAsync(a => a.Nis == nis);
            }

            // 3. Try matching by Name (case-insensitive)
            if (matchingAlumni == null && !string.IsNullOrEmpty(namaLengkap))
            {
                var lowerName = namaLengkap.ToLower();
                matchingAlumni = await _context.Alumni.FirstOrDefaultAsync(a => a.FullName.ToLower() == lowerName);
            }

            if (matchingAlumni != null)
            {
                archive.AlumniId = matchingAlumni.Id;
            }
        }

        private Dictionary<string, object> ParseExtractedFields(string? text)
        {
            var fields = new Dictionary<string, object>();
            if (string.IsNullOrWhiteSpace(text)) return fields;

            string? name = null;
            
            var matchBahwa = System.Text.RegularExpressions.Regex.Match(text, @"bahwa\s*:?\s*([A-Za-z\s',.]{3,50})", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            if (matchBahwa.Success)
            {
                name = matchBahwa.Groups[1].Value.Trim();
            }
            
            if (string.IsNullOrEmpty(name) || name.Equals("siswa", StringComparison.OrdinalIgnoreCase))
            {
                var matchNama = System.Text.RegularExpressions.Regex.Match(text, @"(?:nama\s*(?:lengkap|siswa|alumni)?)\s*[:\-]\s*([A-Za-z\s',.]{3,50})", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
                if (matchNama.Success)
                {
                    name = matchNama.Groups[1].Value.Trim();
                }
            }

            if (!string.IsNullOrEmpty(name))
            {
                var lines = name.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
                if (lines.Length > 0)
                {
                    name = lines[0].Trim();
                }

                int idxCut = name.IndexOf("tempat", StringComparison.OrdinalIgnoreCase);
                if (idxCut >= 0) name = name.Substring(0, idxCut).Trim();
                
                idxCut = name.IndexOf("tanggal", StringComparison.OrdinalIgnoreCase);
                if (idxCut >= 0) name = name.Substring(0, idxCut).Trim();

                idxCut = name.IndexOf("lahir", StringComparison.OrdinalIgnoreCase);
                if (idxCut >= 0) name = name.Substring(0, idxCut).Trim();

                idxCut = name.IndexOf("nomor", StringComparison.OrdinalIgnoreCase);
                if (idxCut >= 0) name = name.Substring(0, idxCut).Trim();

                idxCut = name.IndexOf("lulus", StringComparison.OrdinalIgnoreCase);
                if (idxCut >= 0) name = name.Substring(0, idxCut).Trim();

                name = System.Text.RegularExpressions.Regex.Replace(name, @"[^A-Za-z\s',.]+$", "").Trim();
                
                if (name.Length >= 3)
                {
                    fields["namaLengkap"] = name;
                }
            }

            var matchNisn = System.Text.RegularExpressions.Regex.Match(text, @"\b\d{10}\b");
            if (matchNisn.Success)
            {
                fields["nisn"] = matchNisn.Value;
            }
            else
            {
                var matchNisnLabel = System.Text.RegularExpressions.Regex.Match(text, @"nisn\s*[:\-\s]*([O0-9]{10})", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
                if (matchNisnLabel.Success)
                {
                    fields["nisn"] = matchNisnLabel.Groups[1].Value.Replace('O', '0').Trim();
                }
            }

            var matchNis = System.Text.RegularExpressions.Regex.Match(text, @"(?:nis|nomor\s*induk)\s*[:\-\s]+([O0-9]{5,10})", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            if (matchNis.Success)
            {
                fields["nis"] = matchNis.Groups[1].Value.Replace('O', '0').Trim();
            }

            var matchTempat = System.Text.RegularExpressions.Regex.Match(text, @"(?:tempat\s*(?:dan)?\s*tanggal\s*lahir)\s*[:\-\s]*([A-Za-z]+)", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            if (matchTempat.Success)
            {
                fields["tempatLahir"] = matchTempat.Groups[1].Value.Trim();
            }

            var matchTgl = System.Text.RegularExpressions.Regex.Match(text, @"(\d{1,2}\s+[A-Za-z]+\s+\d{4})", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            if (matchTgl.Success)
            {
                fields["tanggalLahir"] = matchTgl.Value.Trim();
            }

            var matchThn = System.Text.RegularExpressions.Regex.Match(text, @"tahun\s*(?:ajaran|lulus)?\s*[:\-\s]*\d{4}\s*/\s*(\d{4})", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            if (matchThn.Success)
            {
                if (int.TryParse(matchThn.Groups[1].Value, out int yr))
                {
                    fields["tahunLulus"] = yr;
                }
            }
            else
            {
                var matchThn2 = System.Text.RegularExpressions.Regex.Match(text, @"\b(20\d{2})\b");
                if (matchThn2.Success)
                {
                    if (int.TryParse(matchThn2.Groups[1].Value, out int yr))
                    {
                        fields["tahunLulus"] = yr;
                    }
                }
            }

            var matchNoIjazah = System.Text.RegularExpressions.Regex.Match(text, @"(?:nomor|no\.?)\s*ijazah\s*[:\-\s]*([A-Za-z0-9\-\/]+)", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            if (matchNoIjazah.Success)
            {
                fields["nomorIjazah"] = matchNoIjazah.Groups[1].Value.Trim();
            }

            return fields;
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
