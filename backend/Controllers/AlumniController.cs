using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AlumniSmartArchive.Backend.Data;
using AlumniSmartArchive.Backend.Models;
using AlumniSmartArchive.Backend.DTOs;
using AlumniSmartArchive.Backend.Services;

namespace AlumniSmartArchive.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AlumniController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAiService _aiService;

        public AlumniController(AppDbContext context, IAiService aiService)
        {
            _context = context;
            _aiService = aiService;
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

            var resultsList = new List<object>();

            // ──────────────────────────────────────────────────────────────────
            // SUMBER DATA UTAMA: Tabel buku_induk (NamaLengkap, Nis, Nisn)
            // ──────────────────────────────────────────────────────────────────

            // 1a. Exact match di buku_induk
            var exactBukuInduk = await _context.BukuInduks
                .Where(b => b.NamaLengkap.ToLower().Contains(q.ToLower())
                         || b.Nisn.Contains(q)
                         || b.Nis.Contains(q))
                .ToListAsync();

            // Dictionary keyed by BukuInduk.Id untuk dedup.
            // Hanya tandai sebagai "Exact" (100.0) jika query cocok sepenuhnya dengan nama, NIS, atau NISN.
            var bukuIndukResults = exactBukuInduk
                .Where(b => b.NamaLengkap.Equals(q, StringComparison.OrdinalIgnoreCase)
                         || b.Nisn == q
                         || b.Nis == q)
                .Select(b => new { BukuInduk = b, Score = 100.0, MatchType = "Exact" })
                .ToDictionary(x => x.BukuInduk.Id, x => x);

            // 1b. Exact match di tabel alumni (fallback jika ada data di sana)
            var exactAlumni = await _context.Alumni
                .Where(a => a.FullName.ToLower().Contains(q.ToLower())
                         || a.Nisn.Contains(q)
                         || a.Nis.Contains(q))
                .ToListAsync();

            // Set alumni ID yang sudah ditemukan via buku induk agar tidak duplikat
            var foundAlumniIds = bukuIndukResults.Values.Select(x => x.BukuInduk.AlumniId).ToHashSet();

            // ─── FUZZY SEARCH via Python AI Service ───
            bool fuzzyServiceSuccess = false;
            try
            {
                var allBukuInduk = await _context.BukuInduks.ToListAsync();
                var candidates = allBukuInduk.Select(b => b.NamaLengkap).Distinct().ToList();

                var fuzzyResponse = await _aiService.FuzzySearchAsync(q, candidates);
                if (fuzzyResponse != null && fuzzyResponse.Results != null)
                {
                    fuzzyServiceSuccess = true;
                    foreach (var res in fuzzyResponse.Results)
                    {
                        var matched = allBukuInduk
                            .Where(b => b.NamaLengkap.Equals(res.Text, StringComparison.OrdinalIgnoreCase))
                            .ToList();

                        foreach (var buku in matched)
                        {
                            if (!bukuIndukResults.ContainsKey(buku.Id))
                            {
                                bukuIndukResults[buku.Id] = new { BukuInduk = buku, Score = res.Score, MatchType = res.MatchType };
                            }
                            else if (res.Score > bukuIndukResults[buku.Id].Score)
                            {
                                // Overwrite jika fuzzy score lebih tinggi (misal sebelumnya 0 atau default)
                                bukuIndukResults[buku.Id] = new { BukuInduk = buku, Score = res.Score, MatchType = res.MatchType };
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Search] Fuzzy AI Service error (graceful degradation): {ex.Message}");
            }

            // Fallback: Jika AI Service gagal, masukkan semua data contains search yang belum ada sebagai "Fuzzy" dengan perkiraan skor
            if (!fuzzyServiceSuccess)
            {
                foreach (var buku in exactBukuInduk)
                {
                    if (!bukuIndukResults.ContainsKey(buku.Id))
                    {
                        // Karena AI service mati, beri estimasi score. Jika contains, beri 80, jika tidak 70.
                        double estimatedScore = buku.NamaLengkap.ToLower().Contains(q.ToLower()) ? 80.0 : 70.0;
                        bukuIndukResults[buku.Id] = new { BukuInduk = buku, Score = estimatedScore, MatchType = "Fuzzy" };
                    }
                }
            }

            // ──────────────────────────────────────────────────────────────────
            // 3. Format output Buku Induk
            // ──────────────────────────────────────────────────────────────────
            // ──────────────────────────────────────────────────────────────────
            // 3. Format output Buku Induk
            // ──────────────────────────────────────────────────────────────────
            foreach (var item in bukuIndukResults.Values.OrderByDescending(x => x.Score))
            {
                int tahunLulus = 0;
                int.TryParse(item.BukuInduk.TahunLulus, out tahunLulus);
                int targetAlumniId = item.BukuInduk.AlumniId != 0 ? item.BukuInduk.AlumniId : item.BukuInduk.Id;

                resultsList.Add(new {
                    id = targetAlumniId.ToString(),
                    alumniId = targetAlumniId,
                    bukuIndukId = item.BukuInduk.Id,
                    fullName = item.BukuInduk.NamaLengkap,
                    namaLengkap = item.BukuInduk.NamaLengkap,
                    nis = item.BukuInduk.Nis,
                    nisn = item.BukuInduk.Nisn,
                    graduationYear = tahunLulus,
                    tahunLulus = tahunLulus,
                    matchScore = Math.Round(item.Score),
                    matchType = item.MatchType,
                    type = "Buku Induk",
                    status = item.BukuInduk.StatusArsip,
                    identifier = item.BukuInduk.Nisn ?? item.BukuInduk.Nis,
                    link = $"/alumni/{targetAlumniId}",
                    details = $"Alumni Angkatan {item.BukuInduk.TahunLulus} • Status: {item.BukuInduk.StatusSiswa}"
                });
                foundAlumniIds.Add(targetAlumniId);
            }

            // Tambahkan alumni dari tabel alumni yang belum masuk dari buku induk
            foreach (var alumni in exactAlumni.Where(a => !foundAlumniIds.Contains(a.Id)))
            {
                bool isTrueExact = alumni.FullName.Equals(q, StringComparison.OrdinalIgnoreCase)
                                 || alumni.Nisn == q
                                 || alumni.Nis == q;

                double score = isTrueExact ? 100.0 : 80.0; // default 80 jika hanya contains
                string matchType = isTrueExact ? "Exact" : "Fuzzy";

                resultsList.Add(new {
                    id = alumni.Id.ToString(),
                    alumniId = alumni.Id,
                    fullName = alumni.FullName,
                    namaLengkap = alumni.FullName,
                    nis = alumni.Nis,
                    nisn = alumni.Nisn,
                    graduationYear = alumni.GraduationYear,
                    tahunLulus = alumni.GraduationYear,
                    matchScore = score,
                    matchType = matchType,
                    type = "Buku Induk",
                    status = "Aktif",
                    identifier = alumni.Nisn ?? alumni.Nis,
                    link = $"/alumni/{alumni.Id}",
                    details = $"Alumni Angkatan {alumni.GraduationYear}"
                });
                foundAlumniIds.Add(alumni.Id);
            }

            // ──────────────────────────────────────────────────────────────────
            // 4. Cari juga di teks OCR dokumen arsip
            // ──────────────────────────────────────────────────────────────────
            var matchedArchives = await _context.Archives
                .Include(a => a.OcrResult)
                .Include(a => a.Alumni)
                .Where(a => a.OcrResult != null && a.OcrResult.ExtractedText.ToLower().Contains(q.ToLower()))
                .ToListAsync();

            // Arsip terkait alumni yang sudah ditemukan
            var alumniIdList = foundAlumniIds.ToList();
            var associatedArchives = await _context.Archives
                .Include(a => a.OcrResult)
                .Include(a => a.Alumni)
                .Where(a => a.AlumniId.HasValue && alumniIdList.Contains(a.AlumniId.Value))
                .ToListAsync();

            var allMatchedArchives = matchedArchives
                .Concat(associatedArchives)
                .GroupBy(a => a.Id)
                .Select(g => g.First())
                .ToList();

            foreach (var archive in allMatchedArchives)
            {
                // Jika arsip ini sudah punya AlumniId dan alumni tersebut sudah dimasukkan di Buku Induk,
                // tidak perlu membuat baris duplikat sebagai 'archive_XX' di halaman pencarian alumni.
                if (archive.AlumniId.HasValue && foundAlumniIds.Contains(archive.AlumniId.Value))
                {
                    continue;
                }

                string link = "/alumni";
                if (archive.AlumniId.HasValue) link = $"/alumni/{archive.AlumniId.Value}";
                else if (archive.JenisArsip == "Ijazah") link = $"/dokumen-ijazah";
                else if (archive.JenisArsip == "SKHU" || archive.JenisArsip == "SKL" || archive.JenisArsip == "SKL (Surat Keterangan Lulus)") link = $"/dokumen-skhu";
                else if (archive.JenisArsip == "Rapor") link = $"/dokumen-rapor";
                else if (archive.JenisArsip == "Transkrip") link = $"/dokumen-transkrip";

                double docScore = archive.OcrResult != null && archive.OcrResult.ExtractedText.ToLower().Contains(q.ToLower())
                    ? 90.0
                    : 80.0;

                // Dapatkan nama alumni dari buku induk jika ada
                string namaAlumni = archive.Alumni?.FullName ?? "Arsip Umum";
                var terkaitBuku = archive.AlumniId.HasValue
                    ? bukuIndukResults.Values.FirstOrDefault(x => x.BukuInduk.AlumniId == archive.AlumniId.Value)
                    : null;
                if (terkaitBuku != null)
                {
                    namaAlumni = terkaitBuku.BukuInduk.NamaLengkap;
                    docScore = Math.Max(docScore, terkaitBuku.Score - 5.0);
                }

                int? itemAlumniId = archive.AlumniId;
                string itemId = itemAlumniId.HasValue ? itemAlumniId.Value.ToString() : $"archive_{archive.Id}";

                resultsList.Add(new {
                    id = itemId,
                    alumniId = itemAlumniId ?? 0,
                    fullName = namaAlumni,
                    namaLengkap = namaAlumni,
                    nis = archive.Alumni?.Nis ?? string.Empty,
                    nisn = archive.Alumni?.Nisn ?? string.Empty,
                    graduationYear = archive.Alumni?.GraduationYear ?? 0,
                    tahunLulus = archive.Alumni?.GraduationYear ?? 0,
                    matchScore = Math.Round(docScore),
                    matchType = "Fuzzy",
                    type = archive.AlumniId.HasValue ? "Buku Induk" : (archive.JenisArsip == "SKL" || archive.JenisArsip == "SKL (Surat Keterangan Lulus)" ? "SKL" : archive.JenisArsip),
                    status = archive.StatusArsip,
                    identifier = Path.GetFileName(archive.FilePath),
                    link = link,
                    details = $"Ditemukan pada arsip {archive.JenisArsip} • Conf: {Math.Round(archive.OcrResult?.ConfidenceScore ?? 0)}%"
                });
            }

            // Urutkan berdasarkan matchScore tertinggi, prioritaskan "Buku Induk"
            var sortedResults = resultsList
                .Select(x => (dynamic)x)
                .OrderByDescending(x => (string)x.type == "Buku Induk" ? 1 : 0)
                .ThenByDescending(x => (double)x.matchScore)
                .ToList();

            return Ok(sortedResults);
        }


        // GET: api/alumni/5 or api/alumni/archive_95
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            int targetId = 0;

            if (id.StartsWith("archive_", StringComparison.OrdinalIgnoreCase))
            {
                if (int.TryParse(id.Replace("archive_", "", StringComparison.OrdinalIgnoreCase), out int archiveId))
                {
                    var arch = await _context.Archives.FirstOrDefaultAsync(a => a.Id == archiveId);
                    if (arch != null && arch.AlumniId.HasValue)
                    {
                        targetId = arch.AlumniId.Value;
                    }
                    else if (arch != null)
                    {
                        // Fallback: If archive has no AlumniId, return mapped DTO from archive
                        return Ok(new AlumniMappedDto
                        {
                            Id = arch.Id,
                            NamaLengkap = "Arsip #" + arch.Id,
                            NomorIjazah = arch.JenisArsip == "Ijazah" ? System.IO.Path.GetFileName(arch.FilePath) : string.Empty,
                            NomorSkhun = arch.JenisArsip == "SKHU" ? System.IO.Path.GetFileName(arch.FilePath) : string.Empty,
                        });
                    }
                }
            }
            else
            {
                int.TryParse(id, out targetId);
            }

            if (targetId <= 0)
            {
                return NotFound(new { success = false, message = "Data alumni tidak ditemukan" });
            }

            int searchId = targetId;

            var alumni = await _context.Alumni
                .Include(a => a.Mutasis)
                .FirstOrDefaultAsync(a => a.Id == searchId);
                
            BukuInduk? bukuInduk = null;
            if (alumni == null) 
            {
                // Fallback: Try to find by BukuInduk Id
                bukuInduk = await _context.BukuInduks
                    .Include(b => b.NilaiSemesters)
                    .Include(b => b.Ekstrakurikulers)
                    .Include(b => b.PrestasiLombas)
                    .FirstOrDefaultAsync(b => b.Id == searchId);

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
                    .FirstOrDefaultAsync(b => b.AlumniId == searchId);
            }

            // Get related archives
            var archives = alumni != null 
                ? await _context.Archives.Include(a => a.OcrResult).Where(a => a.AlumniId == alumni.Id).ToListAsync()
                : new List<Archive>();

            // Get DetailIjazah with nilai
            var detailIjazah = alumni != null
                ? await _context.DetailIjazahs
                    .Include(d => d.NilaiUjianIjazahs).ThenInclude(n => n.MataPelajaran)
                    .FirstOrDefaultAsync(d => d.AlumniId == alumni.Id)
                : null;

            // Get DetailSkl with nilai
            var detailSkl = alumni != null
                ? await _context.DetailSkls
                    .Include(d => d.NilaiUjianSkls).ThenInclude(n => n.MataPelajaran)
                    .FirstOrDefaultAsync(d => d.AlumniId == alumni.Id)
                : null;

            var mappedData = new AlumniMappedDto
            {
                Id = alumni?.Id ?? (bukuInduk?.Id ?? searchId),
                NamaLengkap = bukuInduk?.NamaLengkap ?? (alumni?.FullName ?? "Unknown"),
                Nis = bukuInduk?.Nis ?? (alumni?.Nis ?? string.Empty),
                Nisn = bukuInduk?.Nisn ?? (alumni?.Nisn ?? string.Empty),
                TempatLahir = bukuInduk?.TempatLahir ?? (alumni?.TempatLahir ?? string.Empty),
                TanggalLahir = string.IsNullOrWhiteSpace(bukuInduk?.TanggalLahir) 
                    ? alumni?.BirthDate 
                    : DateTime.TryParse(bukuInduk.TanggalLahir, out var dob) ? dob : alumni?.BirthDate,
                JenisKelamin = bukuInduk?.JenisKelamin ?? (alumni?.JenisKelamin ?? string.Empty),
                Agama = bukuInduk?.Agama,
                Kewarganegaraan = bukuInduk?.Kewarganegaraan,
                
                TahunLulus = int.TryParse(bukuInduk?.TahunLulus, out var yr) ? yr : (alumni?.GraduationYear ?? 0),
                NomorIjazah = bukuInduk?.NomorIjazah,
                NomorSkhun = bukuInduk?.NomorSkhun,
                StatusSiswa = bukuInduk?.StatusSiswa ?? "Aktif",
                KeteranganStatus = bukuInduk?.KeteranganStatus ?? string.Empty,
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
                    AlumniId = alumni?.Id ?? (bukuInduk?.Id ?? searchId),
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

            // Build extended response with new academic detail tables
            var extendedResponse = new
            {
                success = true,
                data = mappedData,
                detailIjazah = detailIjazah == null ? null : new
                {
                    id = detailIjazah.Id,
                    alumniId = detailIjazah.AlumniId,
                    tanggalPenerbitan = detailIjazah.TanggalPenerbitan,
                    namaKepalaMadrasah = detailIjazah.NamaKepalaMadrasah,
                    rataRataNilai = detailIjazah.RataRataNilai,
                    nilaiUjian = detailIjazah.NilaiUjianIjazahs?.Select(n => new
                    {
                        id = n.Id,
                        mataPelajaranId = n.MataPelajaranId,
                        namaMapel = n.MataPelajaran?.NamaMapel ?? string.Empty,
                        kodeMapel = n.MataPelajaran?.KodeMapel ?? string.Empty,
                        kategori = n.MataPelajaran?.Kategori ?? string.Empty,
                        nilai = n.Nilai
                    }).OrderBy(n => n.kategori).ThenBy(n => n.namaMapel).ToList()
                },
                detailSkl = detailSkl == null ? null : new
                {
                    id = detailSkl.Id,
                    alumniId = detailSkl.AlumniId,
                    nomorPeserta = detailSkl.NomorPeserta,
                    tanggalTerbit = detailSkl.TanggalTerbit,
                    rataRataNilai = detailSkl.RataRataNilai,
                    nilaiUjian = detailSkl.NilaiUjianSkls?.Select(n => new
                    {
                        id = n.Id,
                        mataPelajaranId = n.MataPelajaranId,
                        namaMapel = n.MataPelajaran?.NamaMapel ?? string.Empty,
                        kodeMapel = n.MataPelajaran?.KodeMapel ?? string.Empty,
                        kategori = n.MataPelajaran?.Kategori ?? string.Empty,
                        nilai = n.Nilai
                    }).OrderBy(n => n.kategori).ThenBy(n => n.namaMapel).ToList()
                }
            };

            return Ok(extendedResponse);
        }

        // PUT: api/alumni/5
        [HttpPut("{id}")]
        [Authorize(Roles = "AdminSuper,Admin,Operator,Penulis")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateBukuIndukRequest request)
        {
            var alumni = await _context.Alumni.FindAsync(id);
            if (alumni == null)
            {
                // Fallback check: find if the id refers to a BukuInduk record
                var bi = await _context.BukuInduks.FindAsync(id);
                if (bi != null)
                {
                    alumni = await _context.Alumni.FindAsync(bi.AlumniId);
                }
            }

            if (alumni == null)
                return NotFound(new { success = false, message = "Data alumni tidak ditemukan" });

            // 1. Update Alumni fields
            alumni.Nisn = request.Nisn;
            alumni.Nis = request.Nis;
            alumni.FullName = request.NamaLengkap;
            alumni.JenisKelamin = request.JenisKelamin;
            alumni.TempatLahir = request.TempatLahir;
            alumni.GraduationYear = int.TryParse(request.TahunLulus, out var yr) ? yr : 0;
            alumni.Address = request.AlamatOrangTua;

            // 2. Update connected BukuInduk record if exists, otherwise create it
            var bukuInduk = await _context.BukuInduks
                .Include(b => b.NilaiSemesters)
                    .ThenInclude(ns => ns.NilaiMataPelajarans)
                .Include(b => b.NilaiSemesters)
                    .ThenInclude(ns => ns.DetailLeggerTambahan)
                .Include(b => b.Ekstrakurikulers)
                .Include(b => b.PrestasiLombas)
                .FirstOrDefaultAsync(b => b.AlumniId == alumni.Id);

            if (bukuInduk == null)
            {
                bukuInduk = new BukuInduk { AlumniId = alumni.Id };
                _context.BukuInduks.Add(bukuInduk);
            }

            bukuInduk.Nis = request.Nis;
            bukuInduk.Nisn = request.Nisn;
            bukuInduk.NamaLengkap = request.NamaLengkap;
            bukuInduk.JenisKelamin = request.JenisKelamin;
            bukuInduk.TempatLahir = request.TempatLahir;
            bukuInduk.TanggalLahir = request.TanggalLahir;
            bukuInduk.Agama = request.Agama;
            bukuInduk.Kewarganegaraan = request.Kewarganegaraan;
            bukuInduk.NamaAyah = request.NamaAyah;
            bukuInduk.NamaIbu = request.NamaIbu;
            bukuInduk.PekerjaanAyah = request.PekerjaanAyah;
            bukuInduk.PekerjaanIbu = request.PekerjaanIbu;
            bukuInduk.PendidikanAyah = request.PendidikanAyah;
            bukuInduk.PendidikanIbu = request.PendidikanIbu;
            bukuInduk.AlamatOrangTua = request.AlamatOrangTua;
            bukuInduk.NoHpWali = request.NoHpWali;
            bukuInduk.TahunMasuk = request.TahunMasuk;
            bukuInduk.AsalSekolah = request.AsalSekolah;
            bukuInduk.KelasMasuk = request.KelasMasuk;
            bukuInduk.Jurusan = request.Jurusan;
            bukuInduk.RataRata = request.RataRata;
            bukuInduk.PrestasiAkademik = request.PrestasiAkademik;
            bukuInduk.CatatanKegiatan = request.CatatanKegiatan;
            bukuInduk.TahunLulus = request.TahunLulus;
            bukuInduk.NomorIjazah = request.NomorIjazah;
            bukuInduk.NomorSkhun = request.NomorSkhun;
            bukuInduk.StatusSiswa = request.StatusSiswa;
            bukuInduk.KeteranganStatus = request.KeteranganStatus;
            bukuInduk.EmailAlumni = request.EmailAlumni;
            bukuInduk.NomorHpAlumni = request.NomorHpAlumni;
            bukuInduk.PekerjaanSekarang = request.PekerjaanSekarang;
            bukuInduk.PerguruanTinggi = request.PerguruanTinggi;
            bukuInduk.AlamatSekarang = request.AlamatSekarang;
            bukuInduk.StatusArsip = request.StatusArsip;
            bukuInduk.DiperbaruiPada = DateTime.UtcNow;

            // Replace child collections if provided in request
            if (request.NilaiSemester != null)
            {
                _context.DetailLeggerTambahans.RemoveRange(
                    bukuInduk.NilaiSemesters
                        .Where(ns => ns.DetailLeggerTambahan != null)
                        .Select(ns => ns.DetailLeggerTambahan!));
                _context.NilaiMataPelajarans.RemoveRange(
                    bukuInduk.NilaiSemesters.SelectMany(ns => ns.NilaiMataPelajarans));
                _context.NilaiSemesters.RemoveRange(bukuInduk.NilaiSemesters);

                foreach (var ns in request.NilaiSemester)
                {
                    var nilaiSem = new NilaiSemester
                    {
                        BukuIndukId = bukuInduk.Id,
                        Semester = ns.Semester,
                        RataRata = ns.Rata
                    };
                    foreach (var mp in ns.MataPelajaran)
                    {
                        nilaiSem.NilaiMataPelajarans.Add(new NilaiMataPelajaran
                        {
                            NamaMapel = mp.Nama,
                            Nilai = mp.Nilai
                        });
                    }
                    _context.NilaiSemesters.Add(nilaiSem);
                }
            }

            if (request.Ekskul != null)
            {
                _context.Ekstrakurikulers.RemoveRange(bukuInduk.Ekstrakurikulers);
                foreach (var ek in request.Ekskul)
                {
                    _context.Ekstrakurikulers.Add(new Ekstrakurikuler
                    {
                        BukuIndukId = bukuInduk.Id,
                        Nama = ek.Nama,
                        Jabatan = ek.Jabatan,
                        Tahun = ek.Tahun
                    });
                }
            }

            if (request.PrestasiLomba != null)
            {
                _context.PrestasiLombas.RemoveRange(bukuInduk.PrestasiLombas);
                foreach (var pl in request.PrestasiLomba)
                {
                    _context.PrestasiLombas.Add(new PrestasiLomba
                    {
                        BukuIndukId = bukuInduk.Id,
                        NamaLomba = pl.Nama,
                        Tingkat = pl.Tingkat,
                        Tahun = pl.Tahun,
                        Juara = pl.Juara
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Data alumni berhasil diperbarui" });
        }

        // DELETE: api/alumni/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "AdminSuper,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var alumni = await _context.Alumni.FindAsync(id);
            if (alumni == null)
            {
                // Fallback check: find if the id refers to a BukuInduk record
                var bi = await _context.BukuInduks.FindAsync(id);
                if (bi != null)
                {
                    alumni = await _context.Alumni.FindAsync(bi.AlumniId);
                }
            }

            if (alumni == null)
                return NotFound(new { success = false, message = "Data alumni tidak ditemukan" });

            // 1. Remove associated BukuInduk and all its sub-records
            var bukuInduk = await _context.BukuInduks
                .Include(b => b.NilaiSemesters)
                    .ThenInclude(ns => ns.NilaiMataPelajarans)
                .Include(b => b.NilaiSemesters)
                    .ThenInclude(ns => ns.DetailLeggerTambahan)
                .Include(b => b.Ekstrakurikulers)
                .Include(b => b.PrestasiLombas)
                .FirstOrDefaultAsync(b => b.AlumniId == alumni.Id);

            if (bukuInduk != null)
            {
                _context.DetailLeggerTambahans.RemoveRange(
                    bukuInduk.NilaiSemesters
                        .Where(ns => ns.DetailLeggerTambahan != null)
                        .Select(ns => ns.DetailLeggerTambahan!));
                _context.NilaiMataPelajarans.RemoveRange(
                    bukuInduk.NilaiSemesters.SelectMany(ns => ns.NilaiMataPelajarans));
                _context.NilaiSemesters.RemoveRange(bukuInduk.NilaiSemesters);
                _context.Ekstrakurikulers.RemoveRange(bukuInduk.Ekstrakurikulers);
                _context.PrestasiLombas.RemoveRange(bukuInduk.PrestasiLombas);
                _context.BukuInduks.Remove(bukuInduk);
            }

            // 2. Remove DetailIjazah and its NilaiUjianIjazahs
            var detailIjazah = await _context.DetailIjazahs
                .Include(d => d.NilaiUjianIjazahs)
                .FirstOrDefaultAsync(d => d.AlumniId == alumni.Id);
            if (detailIjazah != null)
            {
                _context.NilaiUjianIjazahs.RemoveRange(detailIjazah.NilaiUjianIjazahs);
                _context.DetailIjazahs.Remove(detailIjazah);
            }

            // 3. Remove DetailSkl and its NilaiUjianSkls
            var detailSkl = await _context.DetailSkls
                .Include(d => d.NilaiUjianSkls)
                .FirstOrDefaultAsync(d => d.AlumniId == alumni.Id);
            if (detailSkl != null)
            {
                _context.NilaiUjianSkls.RemoveRange(detailSkl.NilaiUjianSkls);
                _context.DetailSkls.Remove(detailSkl);
            }

            // 4. Remove Mutasis
            var mutasis = await _context.Mutasis.Where(m => m.AlumniId == alumni.Id).ToListAsync();
            _context.Mutasis.RemoveRange(mutasis);

            // 5. Remove TracerStudies
            var tracerStudies = await _context.TracerStudies.Where(t => t.AlumniId == alumni.Id).ToListAsync();
            _context.TracerStudies.RemoveRange(tracerStudies);

            // 6. Remove PermohonanDokumens
            var permohonans = await _context.PermohonanDokumens.Where(p => p.AlumniId == alumni.Id).ToListAsync();
            _context.PermohonanDokumens.RemoveRange(permohonans);

            // 7. Remove Archives (including physical files and OCR results)
            var archives = await _context.Archives
                .Include(a => a.OcrResult)
                .Where(a => a.AlumniId == alumni.Id)
                .ToListAsync();
            foreach (var archive in archives)
            {
                if (archive.OcrResult != null)
                {
                    _context.OcrResults.Remove(archive.OcrResult);
                }
                
                try
                {
                    if (System.IO.File.Exists(archive.FilePath))
                    {
                        System.IO.File.Delete(archive.FilePath);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Gagal menghapus file fisik: {ex.Message}");
                }
                _context.Archives.Remove(archive);
            }

            // 8. Remove the Alumni record itself
            _context.Alumni.Remove(alumni);

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Data alumni dan seluruh dokumen terkait berhasil dihapus secara permanen" });
        }
    }
}
