using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AlumniSmartArchive.Backend.Data;
using AlumniSmartArchive.Backend.Models;
using AlumniSmartArchive.Backend.DTOs;

namespace AlumniSmartArchive.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlumniController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AlumniController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/alumni
        [HttpGet]
        public async Task<IActionResult> GetAlumni([FromQuery] string? search, [FromQuery] int? tahunLulus)
        {
            var query = _context.Alumni.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var q = search.ToLower();
                query = query.Where(a => a.FullName.ToLower().Contains(q) || a.Nisn.Contains(q) || a.Nis.Contains(q));
            }

            if (tahunLulus.HasValue)
            {
                query = query.Where(a => a.GraduationYear == tahunLulus.Value);
            }

            var alumni = await query.OrderByDescending(a => a.Id).ToListAsync();
            return Ok(alumni);
        }

        // GET: api/alumni/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalAlumni = await _context.Alumni.CountAsync();
            var totalArchives = await _context.Archives.CountAsync();
            var totalBukuInduk = await _context.BukuInduks.CountAsync();
            var ocrSelesai = await _context.OcrResults.CountAsync(o => o.Status == "Selesai");

            return Ok(new
            {
                totalAlumni,
                totalArchives,
                totalBukuInduk,
                ocrSelesai,
                digitizedCount = totalArchives
            });
        }

        // GET: api/alumni/search?q=...
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest("Query tidak boleh kosong");

            var results = await _context.Alumni
                .Where(a => a.FullName.ToLower().Contains(q.ToLower()) || a.Nisn.Contains(q) || a.Nis.Contains(q))
                .ToListAsync();

            return Ok(results);
        }

        // GET: api/alumni/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var alumni = await _context.Alumni
                .Include(a => a.Mutasis)
                .FirstOrDefaultAsync(a => a.Id == id);
                
            BukuInduk? bukuInduk = null;
            if (alumni == null) 
            {
                // Fallback: Try to find by BukuInduk Id
                bukuInduk = await _context.BukuInduks
                    .Include(b => b.NilaiSemesters)
                    .Include(b => b.Ekstrakurikulers)
                    .Include(b => b.PrestasiLombas)
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (bukuInduk == null)
                    return NotFound(new { success = false, message = "Data tidak ditemukan" });
            }
            else 
            {
                // Normal flow: Get related buku induk data
                bukuInduk = await _context.BukuInduks
                    .Include(b => b.NilaiSemesters)
                    .Include(b => b.Ekstrakurikulers)
                    .Include(b => b.PrestasiLombas)
                    .FirstOrDefaultAsync(b => b.AlumniId == id);
            }

            // Get related archives
            var archives = alumni != null 
                ? await _context.Archives.Include(a => a.OcrResult).Where(a => a.AlumniId == alumni.Id).ToListAsync()
                : new List<Archive>();

            var mappedData = new AlumniMappedDto
            {
                Id = alumni?.Id ?? (bukuInduk?.Id ?? id),
                NamaLengkap = bukuInduk?.NamaLengkap ?? (alumni?.FullName ?? "Unknown"),
                Nis = bukuInduk?.Nis ?? alumni?.Nis,
                Nisn = bukuInduk?.Nisn ?? alumni?.Nisn,
                TempatLahir = bukuInduk?.TempatLahir ?? alumni?.TempatLahir,
                TanggalLahir = string.IsNullOrWhiteSpace(bukuInduk?.TanggalLahir) 
                    ? alumni?.BirthDate 
                    : DateTime.TryParse(bukuInduk.TanggalLahir, out var dob) ? dob : alumni?.BirthDate,
                JenisKelamin = bukuInduk?.JenisKelamin ?? alumni?.JenisKelamin,
                Agama = bukuInduk?.Agama,
                Kewarganegaraan = bukuInduk?.Kewarganegaraan,
                
                TahunLulus = int.TryParse(bukuInduk?.TahunLulus, out var yr) ? yr : (alumni?.GraduationYear ?? 0),
                NomorIjazah = bukuInduk?.NomorIjazah,
                NomorSkhun = bukuInduk?.NomorSkhun,
                StatusKelulusan = bukuInduk?.StatusKelulusan ?? "Lulus",
                RataRata = bukuInduk?.RataRata,

                OrangTua = bukuInduk == null ? null : new OrangTuaDto
                {
                    AlumniId = alumni?.Id ?? bukuInduk.Id,
                    NamaAyah = bukuInduk.NamaAyah,
                    PekerjaanAyah = bukuInduk.PekerjaanAyah,
                    NamaIbu = bukuInduk.NamaIbu,
                    PekerjaanIbu = bukuInduk.PekerjaanIbu,
                    Alamat = bukuInduk.AlamatOrangTua,
                    NomorKontak = bukuInduk.NoHpWali
                },

                DataMasuk = bukuInduk == null ? null : new DataMasukDto
                {
                    AlumniId = alumni?.Id ?? bukuInduk.Id,
                    AsalSekolah = bukuInduk.AsalSekolah,
                    KelasAwal = bukuInduk.KelasMasuk,
                    TahunAjaranMasuk = bukuInduk.TahunMasuk
                },

                RiwayatAkademik = bukuInduk?.NilaiSemesters?.Select(ns => new RiwayatAkademikDto
                {
                    AlumniId = alumni?.Id ?? bukuInduk.Id,
                    TingkatKelas = ns.Semester.Contains("VII") && !ns.Semester.Contains("VIII") ? "VII" : ns.Semester.Contains("VIII") ? "VIII" : "IX",
                    TahunAjaran = ns.Semester,
                    Keterangan = $"Rata-rata Semester: {ns.RataRata}",
                    CatatanPrestasi = bukuInduk.PrestasiAkademik
                }).ToList() ?? new List<RiwayatAkademikDto>(),

                Mutasi = alumni?.Mutasis?.Select(m => new MutasiDto
                {
                    Id = m.Id,
                    AlumniId = alumni?.Id ?? bukuInduk.Id,
                    JenisMutasi = m.JenisMutasi,
                    TanggalMutasi = m.TanggalMutasi,
                    SekolahAsalTujuan = m.SekolahAsalTujuan,
                    AlasanMutasi = m.AlasanMutasi
                }).ToList() ?? new List<MutasiDto>(),

                ArsipDokumen = archives.Select(a => new ArsipDokumenDto
                {
                    Id = a.Id,
                    AlumniId = alumni?.Id ?? (bukuInduk?.Id ?? 0),
                    JenisDokumen = a.JenisArsip,
                    NamaFile = System.IO.Path.GetFileName(a.FilePath),
                    PathFile = a.FilePath,
                    UkuranFile = a.UkuranFile,
                    FormatFile = a.FileType,
                    StatusArsip = a.StatusArsip,
                    UploadedAt = a.UploadedAt,
                    OcrText = a.OcrResult?.ExtractedText,
                    OcrConfidence = a.OcrResult?.ConfidenceScore
                }).ToList(),

                CreatedAt = alumni?.DibuatPada ?? (bukuInduk?.DibuatPada ?? DateTime.UtcNow)
            };

            return Ok(new { success = true, data = mappedData });
        }
    }
}
