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
    public class BukuIndukController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BukuIndukController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/bukuinduk
        // Returns all buku induk records (list view for table)
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search,
            [FromQuery] string? tahunLulus,
            [FromQuery] string? statusArsip,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = _context.BukuInduks
                .Include(b => b.NilaiSemesters)
                    .ThenInclude(ns => ns.NilaiMataPelajarans)
                .Include(b => b.NilaiSemesters)
                    .ThenInclude(ns => ns.DetailLeggerTambahan)
                .Include(b => b.Ekstrakurikulers)
                .Include(b => b.PrestasiLombas)
                .AsQueryable();

            // Filter by search (nama or NISN)
            if (!string.IsNullOrWhiteSpace(search))
            {
                var q = search.ToLower();
                query = query.Where(b =>
                    b.NamaLengkap.ToLower().Contains(q) ||
                    b.Nisn.Contains(q) ||
                    b.Nis.Contains(q));
            }

            // Filter by tahun lulus
            if (!string.IsNullOrWhiteSpace(tahunLulus) && tahunLulus != "Semua")
            {
                query = query.Where(b => b.TahunLulus == tahunLulus);
            }

            // Filter by status arsip
            if (!string.IsNullOrWhiteSpace(statusArsip) && statusArsip != "Semua")
            {
                query = query.Where(b => b.StatusArsip == statusArsip);
            }

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var items = await query
                .OrderByDescending(b => b.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var response = items.Select(MapToResponse).ToList();

            return Ok(new
            {
                data = response,
                pagination = new
                {
                    currentPage = page,
                    pageSize,
                    totalItems,
                    totalPages
                }
            });
        }

        // GET: api/bukuinduk/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var record = await _context.BukuInduks
                .Include(b => b.NilaiSemesters)
                    .ThenInclude(ns => ns.NilaiMataPelajarans)
                .Include(b => b.NilaiSemesters)
                    .ThenInclude(ns => ns.DetailLeggerTambahan)
                .Include(b => b.Ekstrakurikulers)
                .Include(b => b.PrestasiLombas)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (record == null)
                return NotFound(new { message = "Data buku induk tidak ditemukan" });

            return Ok(MapToResponse(record));
        }

        // POST: api/bukuinduk
        [HttpPost]
        [Authorize(Roles = "AdminSuper,Admin,Operator")]
        public async Task<IActionResult> Create([FromBody] CreateBukuIndukRequest request)
        {
            // Find or create Alumni record
            var alumni = await _context.Alumni
                .FirstOrDefaultAsync(a => a.Nisn == request.Nisn);

            if (alumni == null)
            {
                alumni = new Alumni
                {
                    Nisn = request.Nisn,
                    Nis = request.Nis,
                    FullName = request.NamaLengkap,
                    JenisKelamin = request.JenisKelamin,
                    TempatLahir = request.TempatLahir,
                    GraduationYear = int.TryParse(request.TahunLulus, out var yr) ? yr : 0,
                    Address = request.AlamatOrangTua
                };
                _context.Alumni.Add(alumni);
                await _context.SaveChangesAsync();
            }

            var bukuInduk = new BukuInduk
            {
                AlumniId = alumni.Id,
                Nis = request.Nis,
                Nisn = request.Nisn,
                NamaLengkap = request.NamaLengkap,
                JenisKelamin = request.JenisKelamin,
                TempatLahir = request.TempatLahir,
                TanggalLahir = request.TanggalLahir,
                Agama = request.Agama,
                Kewarganegaraan = request.Kewarganegaraan,
                NamaAyah = request.NamaAyah,
                NamaIbu = request.NamaIbu,
                PekerjaanAyah = request.PekerjaanAyah,
                PekerjaanIbu = request.PekerjaanIbu,
                PendidikanAyah = request.PendidikanAyah,
                PendidikanIbu = request.PendidikanIbu,
                AlamatOrangTua = request.AlamatOrangTua,
                NoHpWali = request.NoHpWali,
                TahunMasuk = request.TahunMasuk,
                AsalSekolah = request.AsalSekolah,
                KelasMasuk = request.KelasMasuk,
                Jurusan = request.Jurusan,
                RataRata = request.RataRata,
                PrestasiAkademik = request.PrestasiAkademik,
                CatatanKegiatan = request.CatatanKegiatan,
                TahunLulus = request.TahunLulus,
                NomorIjazah = request.NomorIjazah,
                NomorSkhun = request.NomorSkhun,
                StatusSiswa = request.StatusSiswa,
                KeteranganStatus = request.KeteranganStatus,
                EmailAlumni = request.EmailAlumni,
                NomorHpAlumni = request.NomorHpAlumni,
                PekerjaanSekarang = request.PekerjaanSekarang,
                PerguruanTinggi = request.PerguruanTinggi,
                AlamatSekarang = request.AlamatSekarang,
                StatusArsip = request.StatusArsip,
                DibuatPada = DateTime.UtcNow,
                DiperbaruiPada = DateTime.UtcNow
            };

            // Add Nilai Semester
            if (request.NilaiSemester != null)
            {
                foreach (var ns in request.NilaiSemester)
                {
                    var nilaiSem = new NilaiSemester
                    {
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

                    bukuInduk.NilaiSemesters.Add(nilaiSem);
                }
            }

            // Add Ekstrakurikuler
            if (request.Ekskul != null)
            {
                foreach (var ek in request.Ekskul)
                {
                    bukuInduk.Ekstrakurikulers.Add(new Ekstrakurikuler
                    {
                        Nama = ek.Nama,
                        Jabatan = ek.Jabatan,
                        Tahun = ek.Tahun
                    });
                }
            }

            // Add Prestasi Lomba
            if (request.PrestasiLomba != null)
            {
                foreach (var pl in request.PrestasiLomba)
                {
                    bukuInduk.PrestasiLombas.Add(new PrestasiLomba
                    {
                        NamaLomba = pl.Nama,
                        Tingkat = pl.Tingkat,
                        Tahun = pl.Tahun,
                        Juara = pl.Juara
                    });
                }
            }

            _context.BukuInduks.Add(bukuInduk);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = bukuInduk.Id }, MapToResponse(bukuInduk));
        }

        // POST: api/bukuinduk/import
        [HttpPost("import")]
        [Authorize(Roles = "AdminSuper,Admin,Operator")]
        public async Task<IActionResult> Import([FromBody] List<CreateBukuIndukRequest> requests)
        {
            if (requests == null || !requests.Any())
                return BadRequest(new { message = "Data tidak boleh kosong" });

            int addedCount = 0;
            int skippedCount = 0;

            foreach (var req in requests)
            {
                // Skip jika NISN sudah ada (mencegah duplikasi)
                if (await _context.BukuInduks.AnyAsync(b => b.Nisn == req.Nisn))
                {
                    skippedCount++;
                    continue;
                }

                // Cari atau buat Alumni
                var alumni = await _context.Alumni.FirstOrDefaultAsync(a => a.Nisn == req.Nisn);
                if (alumni == null)
                {
                    alumni = new Alumni
                    {
                        Nisn = req.Nisn,
                        Nis = req.Nis,
                        FullName = req.NamaLengkap,
                        JenisKelamin = req.JenisKelamin,
                        TempatLahir = req.TempatLahir ?? "",
                        GraduationYear = int.TryParse(req.TahunLulus, out var yr) ? yr : 0,
                    };
                    _context.Alumni.Add(alumni);
                    await _context.SaveChangesAsync();
                }

                var bukuInduk = new BukuInduk
                {
                    AlumniId = alumni.Id,
                    Nis = req.Nis,
                    Nisn = req.Nisn,
                    NamaLengkap = req.NamaLengkap,
                    JenisKelamin = req.JenisKelamin,
                    TempatLahir = req.TempatLahir ?? "",
                    TanggalLahir = req.TanggalLahir ?? "",
                    Agama = req.Agama ?? "",
                    Kewarganegaraan = req.Kewarganegaraan ?? "WNI",
                    
                    // Data Keluarga
                    NamaAyah = req.NamaAyah ?? "",
                    NamaIbu = req.NamaIbu ?? "",
                    PekerjaanAyah = req.PekerjaanAyah ?? "",
                    PekerjaanIbu = req.PekerjaanIbu ?? "",
                    AlamatOrangTua = req.AlamatOrangTua ?? "",
                    NoHpWali = req.NoHpWali ?? "",

                    // Data Sekolah
                    TahunMasuk = req.TahunMasuk ?? "",
                    AsalSekolah = req.AsalSekolah ?? "",
                    KelasMasuk = req.KelasMasuk ?? "",
                    TahunLulus = req.TahunLulus ?? "",
                    NomorIjazah = req.NomorIjazah ?? "",
                    NomorSkhun = req.NomorSkhun ?? "",
                    StatusSiswa = req.StatusSiswa ?? "Aktif",
                    KeteranganStatus = req.KeteranganStatus ?? "",
                    StatusArsip = req.StatusArsip ?? "Lengkap",
                    
                    DibuatPada = DateTime.UtcNow,
                    DiperbaruiPada = DateTime.UtcNow
                };

                bukuInduk.NilaiSemesters = new List<NilaiSemester>();
                for (int sem = 1; sem <= 6; sem++)
                {
                    bukuInduk.NilaiSemesters.Add(new NilaiSemester
                    {
                        Semester = sem.ToString(),
                        RataRata = 0,
                        DetailLeggerTambahan = new DetailLeggerTambahan
                        {
                            KehadiranSakit = 0,
                            KehadiranIzin = 0,
                            KehadiranAlfa = 0,
                            SikapSpiritual = "Baik",
                            SikapSosial = "Baik",
                            CatatanWaliKelas = "",
                            DibuatPada = DateTime.UtcNow
                        }
                    });
                }

                _context.BukuInduks.Add(bukuInduk);

                // Auto-create DetailIjazah for the alumni if it does not exist
                var hasIjazah = await _context.DetailIjazahs.AnyAsync(di => di.AlumniId == alumni.Id);
                if (!hasIjazah)
                {
                    var detailIjazah = new DetailIjazah
                    {
                        AlumniId = alumni.Id,
                        NamaKepalaMadrasah = "Drs. H. Ahmad Fauzi, M.Pd.I",
                        TanggalPenerbitan = DateTime.UtcNow,
                        DibuatPada = DateTime.UtcNow,
                        RataRataNilai = 0
                    };
                    _context.DetailIjazahs.Add(detailIjazah);
                }

                // Auto-create DetailSkl for the alumni if it does not exist
                var hasSkl = await _context.DetailSkls.AnyAsync(ds => ds.AlumniId == alumni.Id);
                if (!hasSkl)
                {
                    var detailSkl = new DetailSkl
                    {
                        AlumniId = alumni.Id,
                        NomorPeserta = string.IsNullOrWhiteSpace(req.NomorSkhun) ? "-" : req.NomorSkhun,
                        TanggalTerbit = DateTime.UtcNow,
                        DibuatPada = DateTime.UtcNow,
                        RataRataNilai = 0
                    };
                    _context.DetailSkls.Add(detailSkl);
                }

                addedCount++;
            }

            await _context.SaveChangesAsync();
            return Ok(new { 
                success = true, 
                message = $"Berhasil mengimpor {addedCount} data. {skippedCount} data dilewati karena duplikasi NISN.",
                added = addedCount,
                skipped = skippedCount
            });
        }

        // PUT: api/bukuinduk/5
        [HttpPut("{id}")]
        [Authorize(Roles = "AdminSuper,Admin,Operator,Penulis")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateBukuIndukRequest request)
        {
            var existing = await _context.BukuInduks
                .Include(b => b.Alumni)
                .Include(b => b.NilaiSemesters)
                    .ThenInclude(ns => ns.NilaiMataPelajarans)
                .Include(b => b.NilaiSemesters)
                    .ThenInclude(ns => ns.DetailLeggerTambahan)
                .Include(b => b.Ekstrakurikulers)
                .Include(b => b.PrestasiLombas)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (existing == null)
                return NotFound(new { message = "Data buku induk tidak ditemukan" });

            // Sync with related Alumni record
            if (existing.Alumni != null)
            {
                existing.Alumni.Nisn = request.Nisn;
                existing.Alumni.Nis = request.Nis;
                existing.Alumni.FullName = request.NamaLengkap;
                existing.Alumni.JenisKelamin = request.JenisKelamin;
                existing.Alumni.TempatLahir = request.TempatLahir;
                existing.Alumni.GraduationYear = int.TryParse(request.TahunLulus, out var yr) ? yr : 0;
                existing.Alumni.Address = request.AlamatOrangTua;
            }

            // Update scalar fields
            existing.Nis = request.Nis;
            existing.Nisn = request.Nisn;
            existing.NamaLengkap = request.NamaLengkap;
            existing.JenisKelamin = request.JenisKelamin;
            existing.TempatLahir = request.TempatLahir;
            existing.TanggalLahir = request.TanggalLahir;
            existing.Agama = request.Agama;
            existing.Kewarganegaraan = request.Kewarganegaraan;
            existing.NamaAyah = request.NamaAyah;
            existing.NamaIbu = request.NamaIbu;
            existing.PekerjaanAyah = request.PekerjaanAyah;
            existing.PekerjaanIbu = request.PekerjaanIbu;
            existing.PendidikanAyah = request.PendidikanAyah;
            existing.PendidikanIbu = request.PendidikanIbu;
            existing.AlamatOrangTua = request.AlamatOrangTua;
            existing.NoHpWali = request.NoHpWali;
            existing.TahunMasuk = request.TahunMasuk;
            existing.AsalSekolah = request.AsalSekolah;
            existing.KelasMasuk = request.KelasMasuk;
            existing.Jurusan = request.Jurusan;
            existing.RataRata = request.RataRata;
            existing.PrestasiAkademik = request.PrestasiAkademik;
            existing.CatatanKegiatan = request.CatatanKegiatan;
            existing.TahunLulus = request.TahunLulus;
            existing.NomorIjazah = request.NomorIjazah;
            existing.NomorSkhun = request.NomorSkhun;
            existing.StatusSiswa = request.StatusSiswa;
            existing.KeteranganStatus = request.KeteranganStatus;
            existing.EmailAlumni = request.EmailAlumni;
            existing.NomorHpAlumni = request.NomorHpAlumni;
            existing.PekerjaanSekarang = request.PekerjaanSekarang;
            existing.PerguruanTinggi = request.PerguruanTinggi;
            existing.AlamatSekarang = request.AlamatSekarang;
            existing.StatusArsip = request.StatusArsip;
            existing.DiperbaruiPada = DateTime.UtcNow;

            // Replace child collections
            if (request.NilaiSemester != null)
            {
                // Remove old (including legger tambahan)
                _context.DetailLeggerTambahans.RemoveRange(
                    existing.NilaiSemesters
                        .Where(ns => ns.DetailLeggerTambahan != null)
                        .Select(ns => ns.DetailLeggerTambahan!));
                _context.NilaiMataPelajarans.RemoveRange(
                    existing.NilaiSemesters.SelectMany(ns => ns.NilaiMataPelajarans));
                _context.NilaiSemesters.RemoveRange(existing.NilaiSemesters);

                // Add new
                foreach (var ns in request.NilaiSemester)
                {
                    var nilaiSem = new NilaiSemester
                    {
                        BukuIndukId = id,
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
                _context.Ekstrakurikulers.RemoveRange(existing.Ekstrakurikulers);
                foreach (var ek in request.Ekskul)
                {
                    _context.Ekstrakurikulers.Add(new Ekstrakurikuler
                    {
                        BukuIndukId = id,
                        Nama = ek.Nama,
                        Jabatan = ek.Jabatan,
                        Tahun = ek.Tahun
                    });
                }
            }

            if (request.PrestasiLomba != null)
            {
                _context.PrestasiLombas.RemoveRange(existing.PrestasiLombas);
                foreach (var pl in request.PrestasiLomba)
                {
                    _context.PrestasiLombas.Add(new PrestasiLomba
                    {
                        BukuIndukId = id,
                        NamaLomba = pl.Nama,
                        Tingkat = pl.Tingkat,
                        Tahun = pl.Tahun,
                        Juara = pl.Juara
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Data buku induk berhasil diperbarui" });
        }

        // DELETE: api/bukuinduk/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "AdminSuper,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var record = await _context.BukuInduks
                .Include(b => b.NilaiSemesters)
                    .ThenInclude(ns => ns.NilaiMataPelajarans)
                .Include(b => b.NilaiSemesters)
                    .ThenInclude(ns => ns.DetailLeggerTambahan)
                .Include(b => b.Ekstrakurikulers)
                .Include(b => b.PrestasiLombas)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (record == null)
                return NotFound(new { message = "Data buku induk tidak ditemukan" });

            // Remove children first (including legger tambahan)
            _context.DetailLeggerTambahans.RemoveRange(
                record.NilaiSemesters
                    .Where(ns => ns.DetailLeggerTambahan != null)
                    .Select(ns => ns.DetailLeggerTambahan!));
            _context.NilaiMataPelajarans.RemoveRange(
                record.NilaiSemesters.SelectMany(ns => ns.NilaiMataPelajarans));
            _context.NilaiSemesters.RemoveRange(record.NilaiSemesters);
            _context.Ekstrakurikulers.RemoveRange(record.Ekstrakurikulers);
            _context.PrestasiLombas.RemoveRange(record.PrestasiLombas);
            _context.BukuInduks.Remove(record);

            await _context.SaveChangesAsync();
            return Ok(new { message = "Data buku induk berhasil dihapus" });
        }

        // GET: api/bukuinduk/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var total = await _context.BukuInduks.CountAsync();
            var lengkap = await _context.BukuInduks.CountAsync(b => b.StatusArsip == "Lengkap");
            var belumLengkap = await _context.BukuInduks.CountAsync(b => b.StatusArsip == "Belum Lengkap");
            var hilang = await _context.BukuInduks.CountAsync(b => b.StatusArsip == "Arsip Hilang");

            var tahunList = await _context.BukuInduks
                .Where(b => !string.IsNullOrEmpty(b.TahunLulus))
                .Select(b => b.TahunLulus)
                .Distinct()
                .OrderByDescending(t => t)
                .ToListAsync();

            return Ok(new
            {
                total,
                lengkap,
                belumLengkap,
                hilang,
                tahunLulusList = tahunList
            });
        }

        // ── Helper: Map entity to response DTO ──
        private static BukuIndukResponse MapToResponse(BukuInduk b)
        {
            return new BukuIndukResponse
            {
                Id = b.Id,
                AlumniId = b.AlumniId,
                Nis = b.Nis,
                Nisn = b.Nisn,
                NamaLengkap = b.NamaLengkap,
                JenisKelamin = b.JenisKelamin,
                TempatLahir = b.TempatLahir,
                TanggalLahir = b.TanggalLahir,
                Agama = b.Agama,
                Kewarganegaraan = b.Kewarganegaraan,
                NamaAyah = b.NamaAyah,
                NamaIbu = b.NamaIbu,
                PekerjaanAyah = b.PekerjaanAyah,
                PekerjaanIbu = b.PekerjaanIbu,
                PendidikanAyah = b.PendidikanAyah,
                PendidikanIbu = b.PendidikanIbu,
                AlamatOrangTua = b.AlamatOrangTua,
                NoHpWali = b.NoHpWali,
                TahunMasuk = b.TahunMasuk,
                AsalSekolah = b.AsalSekolah,
                KelasMasuk = b.KelasMasuk,
                Jurusan = b.Jurusan,
                NilaiSemester = b.NilaiSemesters?.Select(ns => new NilaiSemesterDto
                {
                    Semester = ns.Semester,
                    Rata = ns.RataRata,
                    MataPelajaran = ns.NilaiMataPelajarans?.Select(mp => new NilaiMapelDto
                    {
                        Nama = mp.NamaMapel,
                        Nilai = mp.Nilai
                    }).ToList() ?? new()
                }).ToList() ?? new(),
                // Legacy field kept for backward compatibility
                // LeggerTambahan is now embedded in NilaiSemesterFullDto
                RataRata = b.RataRata,
                PrestasiAkademik = b.PrestasiAkademik,
                Ekskul = b.Ekstrakurikulers?.Select(e => new EkskulDto
                {
                    Nama = e.Nama,
                    Jabatan = e.Jabatan,
                    Tahun = e.Tahun
                }).ToList() ?? new(),
                PrestasiLomba = b.PrestasiLombas?.Select(p => new PrestasiDto
                {
                    Nama = p.NamaLomba,
                    Tingkat = p.Tingkat,
                    Tahun = p.Tahun,
                    Juara = p.Juara
                }).ToList() ?? new(),
                CatatanKegiatan = b.CatatanKegiatan,
                TahunLulus = b.TahunLulus,
                NomorIjazah = b.NomorIjazah,
                NomorSkhun = b.NomorSkhun,
                StatusSiswa = b.StatusSiswa,
                KeteranganStatus = b.KeteranganStatus,
                EmailAlumni = b.EmailAlumni,
                NomorHpAlumni = b.NomorHpAlumni,
                PekerjaanSekarang = b.PekerjaanSekarang,
                PerguruanTinggi = b.PerguruanTinggi,
                AlamatSekarang = b.AlamatSekarang,
                StatusArsip = b.StatusArsip,
                Foto = b.Foto,
                NilaiSemesterFull = b.NilaiSemesters?.Select(ns => new NilaiSemesterFullDto
                {
                    Id = ns.Id,
                    Semester = ns.Semester,
                    Rata = ns.RataRata,
                    MataPelajaran = ns.NilaiMataPelajarans?.Select(mp => new NilaiMapelDto
                    {
                        Nama = mp.NamaMapel,
                        Nilai = mp.Nilai
                    }).ToList() ?? new(),
                    LeggerTambahan = ns.DetailLeggerTambahan == null ? null : new DetailLeggerTambahanDto
                    {
                        Id = ns.DetailLeggerTambahan.Id,
                        NilaiSemesterId = ns.DetailLeggerTambahan.NilaiSemesterId,
                        KehadiranSakit = ns.DetailLeggerTambahan.KehadiranSakit,
                        KehadiranIzin = ns.DetailLeggerTambahan.KehadiranIzin,
                        KehadiranAlfa = ns.DetailLeggerTambahan.KehadiranAlfa,
                        SikapSpiritual = ns.DetailLeggerTambahan.SikapSpiritual,
                        SikapSosial = ns.DetailLeggerTambahan.SikapSosial,
                        CatatanWaliKelas = ns.DetailLeggerTambahan.CatatanWaliKelas
                    }
                }).ToList() ?? new()
            };
        }

        // ── DetailLeggerTambahan Endpoints ──

        // GET: api/bukuinduk/legger/{nilaiSemesterId}
        [HttpGet("legger/{nilaiSemesterId}")]
        public async Task<IActionResult> GetLegger(int nilaiSemesterId)
        {
            var legger = await _context.DetailLeggerTambahans
                .FirstOrDefaultAsync(l => l.NilaiSemesterId == nilaiSemesterId);

            if (legger == null)
                return Ok(null);

            return Ok(new DetailLeggerTambahanDto
            {
                Id = legger.Id,
                NilaiSemesterId = legger.NilaiSemesterId,
                KehadiranSakit = legger.KehadiranSakit,
                KehadiranIzin = legger.KehadiranIzin,
                KehadiranAlfa = legger.KehadiranAlfa,
                SikapSpiritual = legger.SikapSpiritual,
                SikapSosial = legger.SikapSosial,
                CatatanWaliKelas = legger.CatatanWaliKelas
            });
        }

        // POST/PUT: api/bukuinduk/legger (upsert)
        [HttpPost("legger")]
        [Authorize(Roles = "AdminSuper,Admin,Operator,Penulis")]
        public async Task<IActionResult> UpsertLegger([FromBody] DetailLeggerTambahanDto request)
        {
            // Verify NilaiSemester exists
            var semester = await _context.NilaiSemesters.FindAsync(request.NilaiSemesterId);
            if (semester == null)
                return BadRequest(new { message = "Data semester tidak ditemukan" });

            var existing = await _context.DetailLeggerTambahans
                .FirstOrDefaultAsync(l => l.NilaiSemesterId == request.NilaiSemesterId);

            if (existing == null)
            {
                // Create
                existing = new DetailLeggerTambahan
                {
                    NilaiSemesterId = request.NilaiSemesterId,
                    KehadiranSakit = request.KehadiranSakit,
                    KehadiranIzin = request.KehadiranIzin,
                    KehadiranAlfa = request.KehadiranAlfa,
                    SikapSpiritual = request.SikapSpiritual,
                    SikapSosial = request.SikapSosial,
                    CatatanWaliKelas = request.CatatanWaliKelas,
                    DibuatPada = DateTime.UtcNow
                };
                _context.DetailLeggerTambahans.Add(existing);
            }
            else
            {
                // Update
                existing.KehadiranSakit = request.KehadiranSakit;
                existing.KehadiranIzin = request.KehadiranIzin;
                existing.KehadiranAlfa = request.KehadiranAlfa;
                existing.SikapSpiritual = request.SikapSpiritual;
                existing.SikapSosial = request.SikapSosial;
                existing.CatatanWaliKelas = request.CatatanWaliKelas;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Data legger tambahan berhasil disimpan", id = existing.Id });
        }
    }
}
