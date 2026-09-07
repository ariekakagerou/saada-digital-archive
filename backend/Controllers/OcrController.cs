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
            try
            {
                if (request == null)
                {
                    return BadRequest(new { success = false, message = "Permintaan tidak valid. Data kosong." });
                }

                var ocr = await _context.OcrResults
                    .Include(o => o.Archive)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (ocr == null) return NotFound(new { success = false, message = "Hasil OCR tidak ditemukan" });

                // Mengizinkan pengguna/petugas memperbaiki teks OCR
                ocr.ExtractedText = request.ExtractedText ?? ocr.ExtractedText;
                
                // Tandai bahwa ini sudah dikoreksi / diview oleh manusia (Human-in-the-loop)
                ocr.Status = "Ditinjau";

                // Coba hubungkan kembali ke data Alumni jika teks berubah
                if (ocr.Archive != null)
                {
                    await TryLinkAlumniFromText(ocr.Archive, ocr.ExtractedText);
                }

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Koreksi OCR berhasil disimpan", data = ocr });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Gagal menyimpan koreksi OCR: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                return StatusCode(500, new { success = false, message = $"Terjadi kesalahan internal server: {ex.Message}" });
            }
        }

        private async Task TryLinkAlumniFromText(Archive archive, string text)
        {
            if (string.IsNullOrEmpty(text)) return;

            var parsed = ParseExtractedFields(text);
            string? nisn = parsed.ContainsKey("nisn") ? parsed["nisn"]?.ToString() : null;
            string? nis = parsed.ContainsKey("nis") ? parsed["nis"]?.ToString() : null;
            string? namaLengkap = parsed.ContainsKey("namaLengkap") ? parsed["namaLengkap"]?.ToString() : null;

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
            else
            {
                archive.AlumniId = null; // Unlink if it no longer matches
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
    }

    public class UpdateOcrRequest
    {
        public string ExtractedText { get; set; } = string.Empty;
    }
}
