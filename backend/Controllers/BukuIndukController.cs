using AlumniSmartArchive.Backend.Data;
using AlumniSmartArchive.Backend.DTOs;
using AlumniSmartArchive.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlumniSmartArchive.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
                .Include(b => b.Ekstrakurikulers)
                .Include(b => b.PrestasiLombas)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (record == null)
                return NotFound(new { message = "Data buku induk tidak ditemukan" });

            return Ok(MapToResponse(record));
        }

        // POST: api/bukuinduk
        [HttpPost]
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
                StatusKelulusan = request.StatusKelulusan,
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

        // PUT: api/bukuinduk/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateBukuIndukRequest request)
        {
            var existing = await _context.BukuInduks
                .Include(b => b.NilaiSemesters)
                    .ThenInclude(ns => ns.NilaiMataPelajarans)
                .Include(b => b.Ekstrakurikulers)
                .Include(b => b.PrestasiLombas)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (existing == null)
                return NotFound(new { message = "Data buku induk tidak ditemukan" });

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
            existing.StatusKelulusan = request.StatusKelulusan;
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
                // Remove old
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
        public async Task<IActionResult> Delete(int id)
        {
            var record = await _context.BukuInduks
                .Include(b => b.NilaiSemesters)
                    .ThenInclude(ns => ns.NilaiMataPelajarans)
                .Include(b => b.Ekstrakurikulers)
                .Include(b => b.PrestasiLombas)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (record == null)
                return NotFound(new { message = "Data buku induk tidak ditemukan" });

            // Remove children first
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
                StatusKelulusan = b.StatusKelulusan,
                EmailAlumni = b.EmailAlumni,
                NomorHpAlumni = b.NomorHpAlumni,
                PekerjaanSekarang = b.PekerjaanSekarang,
                PerguruanTinggi = b.PerguruanTinggi,
                AlamatSekarang = b.AlamatSekarang,
                StatusArsip = b.StatusArsip,
                Foto = b.Foto
            };
        }
    }
}
