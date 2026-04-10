using AlumniSmartArchive.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace AlumniSmartArchive.Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // ── Core Tables ──
        public DbSet<User> Users { get; set; }
        public DbSet<Alumni> Alumni { get; set; }
        public DbSet<Archive> Archives { get; set; }
        public DbSet<OcrResult> OcrResults { get; set; }
        public DbSet<LogAktivitas> LogAktivitas { get; set; }

        // ── Buku Induk Tables ──
        public DbSet<BukuInduk> BukuInduks { get; set; }
        public DbSet<NilaiSemester> NilaiSemesters { get; set; }
        public DbSet<NilaiMataPelajaran> NilaiMataPelajarans { get; set; }
        public DbSet<Ekstrakurikuler> Ekstrakurikulers { get; set; }
        public DbSet<PrestasiLomba> PrestasiLombas { get; set; }
        public DbSet<Mutasi> Mutasis { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ── Seed: Users ──
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Username = "admin", FullName = "Kepala Pengarsipan", Email = "admin@mts.sch.id", Nip = "198501012010011001", PasswordHash = "admin123", Role = "Admin", Active = true },
                new User { Id = 2, Username = "operator", FullName = "Petugas Digitalisasi", Email = "operator@mts.sch.id", Nip = "199001012015011001", PasswordHash = "admin123", Role = "Operator", Active = true },
                new User { Id = 3, Username = "penulis", FullName = "Penulis Buku Induk", Email = "penulis@mts.sch.id", Nip = "199201012016011001", PasswordHash = "admin123", Role = "Penulis", Active = true },
                new User { Id = 4, Username = "superuser", FullName = "Super Administrator", Email = "super@mts.sch.id", Nip = "198001011995011001", PasswordHash = "admin123", Role = "AdminSuper", Active = true }
            );

            // ── Seed: Alumni ──
            modelBuilder.Entity<Alumni>().HasData(
                new Alumni { Id = 1, FullName = "Ahmad Faisal Ramadhan", Nisn = "0021001234", Nis = "21001", JenisKelamin = "L", TempatLahir = "Malang", GraduationYear = 2024, BirthDate = new DateTime(2005, 2, 10), Address = "Jl. Veteran No. 45, Malang" },
                new Alumni { Id = 2, FullName = "Siti Aminah Putri", Nisn = "0021002345", Nis = "21002", JenisKelamin = "P", TempatLahir = "Surabaya", GraduationYear = 2023, BirthDate = new DateTime(2006, 5, 15), Address = "Jl. Merdeka No. 10, Surabaya" },
                new Alumni { Id = 3, FullName = "Dewi Lestari", Nisn = "0021003456", Nis = "21003", JenisKelamin = "P", TempatLahir = "Blitar", GraduationYear = 2024, BirthDate = new DateTime(2006, 7, 10), Address = "Jl. Kenanga No. 8, Blitar" },
                new Alumni { Id = 4, FullName = "Muhammad Rizky Hidayat", Nisn = "0021004567", Nis = "21004", JenisKelamin = "L", TempatLahir = "Kediri", GraduationYear = 2023, BirthDate = new DateTime(2005, 11, 20), Address = "Jl. Ahmad Yani No. 25, Kediri" },
                new Alumni { Id = 5, FullName = "Nur Aisyah Rahmawati", Nisn = "0021005678", Nis = "21005", JenisKelamin = "P", TempatLahir = "Malang", GraduationYear = 2024, BirthDate = new DateTime(2006, 3, 5), Address = "Jl. Diponegoro No. 3, Malang" }
            );

            // ── Seed: Buku Induk (2 records to match frontend mock) ──
            modelBuilder.Entity<BukuInduk>().HasData(
                new BukuInduk
                {
                    Id = 1, AlumniId = 1,
                    Nis = "21001", Nisn = "0021001234", NamaLengkap = "Ahmad Faisal Ramadhan",
                    JenisKelamin = "L", TempatLahir = "Malang", TanggalLahir = "10 Februari 2005",
                    Agama = "Islam", Kewarganegaraan = "WNI",
                    NamaAyah = "Rahmat Faisal", NamaIbu = "Siti Nurhaliza",
                    PekerjaanAyah = "Wiraswasta", PekerjaanIbu = "Ibu Rumah Tangga",
                    PendidikanAyah = "S1", PendidikanIbu = "SMA",
                    AlamatOrangTua = "Jl. Veteran No. 45, Malang", NoHpWali = "081234567890",
                    TahunMasuk = "2021", AsalSekolah = "SDN 1 Malang", KelasMasuk = "VII-A", Jurusan = "-",
                    RataRata = 89.9, PrestasiAkademik = "Juara 1 Kelas selama 4 semester berturut-turut",
                    CatatanKegiatan = "Aktif dalam kegiatan OSIS, menjadi perwakilan sekolah dalam berbagai lomba akademik.",
                    TahunLulus = "2024", NomorIjazah = "DN-05-7/MTs/001/2024", NomorSkhun = "SKHUN/MTs/001/2024",
                    StatusKelulusan = "Lulus",
                    EmailAlumni = "ahmadfaisal@email.com", NomorHpAlumni = "082345678901",
                    PekerjaanSekarang = "Mahasiswa", PerguruanTinggi = "Universitas Brawijaya Malang",
                    AlamatSekarang = "Jl. MT. Haryono No. 165, Malang",
                    StatusArsip = "Lengkap"
                },
                new BukuInduk
                {
                    Id = 2, AlumniId = 2,
                    Nis = "21002", Nisn = "0021002345", NamaLengkap = "Siti Aminah Putri",
                    JenisKelamin = "P", TempatLahir = "Surabaya", TanggalLahir = "15 Mei 2006",
                    Agama = "Islam", Kewarganegaraan = "WNI",
                    NamaAyah = "Hasan Basri", NamaIbu = "Aminah Wulandari",
                    PekerjaanAyah = "PNS", PekerjaanIbu = "Guru",
                    PendidikanAyah = "S2", PendidikanIbu = "S1",
                    AlamatOrangTua = "Jl. Merdeka No. 10, Surabaya", NoHpWali = "085678901234",
                    TahunMasuk = "2020", AsalSekolah = "SDN Kebonsari 1", KelasMasuk = "VII-B", Jurusan = "-",
                    RataRata = 90.8, PrestasiAkademik = "Lulusan terbaik angkatan 2023 bidang Bahasa Indonesia",
                    CatatanKegiatan = "Aktif dalam kegiatan literasi dan kesenian sekolah.",
                    TahunLulus = "2023", NomorIjazah = "DN-05-7/MTs/045/2023", NomorSkhun = "SKHUN/MTs/045/2023",
                    StatusKelulusan = "Lulus",
                    EmailAlumni = "sitiaminah@email.com", NomorHpAlumni = "089012345678",
                    PekerjaanSekarang = "Mahasiswa", PerguruanTinggi = "Universitas Airlangga Surabaya",
                    AlamatSekarang = "Jl. Dharmawangsa No. 5, Surabaya",
                    StatusArsip = "Lengkap"
                },
                new BukuInduk
                {
                    Id = 3, AlumniId = 3,
                    Nis = "21003", Nisn = "0021003456", NamaLengkap = "Dewi Lestari",
                    JenisKelamin = "P", TempatLahir = "Blitar", TanggalLahir = "10 Juli 2006",
                    Agama = "Islam", Kewarganegaraan = "WNI",
                    NamaAyah = "Suryadi", NamaIbu = "Lestari Dewi",
                    PekerjaanAyah = "Petani", PekerjaanIbu = "Pedagang",
                    PendidikanAyah = "SMP", PendidikanIbu = "SMP",
                    AlamatOrangTua = "Jl. Kenanga No. 8, Blitar", NoHpWali = "087654321098",
                    TahunMasuk = "2021", AsalSekolah = "SDN 2 Blitar", KelasMasuk = "VII-A", Jurusan = "-",
                    RataRata = 82.5, PrestasiAkademik = "-",
                    CatatanKegiatan = "Anggota aktif PMR.",
                    TahunLulus = "2024", NomorIjazah = "DN-05-7/MTs/003/2024", NomorSkhun = "SKHUN/MTs/003/2024",
                    StatusKelulusan = "Lulus",
                    EmailAlumni = "", NomorHpAlumni = "081234000111",
                    PekerjaanSekarang = "", PerguruanTinggi = "",
                    AlamatSekarang = "Jl. Kenanga No. 8, Blitar",
                    StatusArsip = "Belum Lengkap"
                },
                new BukuInduk
                {
                    Id = 4, AlumniId = 4,
                    Nis = "21004", Nisn = "0021004567", NamaLengkap = "Muhammad Rizky Hidayat",
                    JenisKelamin = "L", TempatLahir = "Kediri", TanggalLahir = "20 November 2005",
                    Agama = "Islam", Kewarganegaraan = "WNI",
                    NamaAyah = "Rizky Pratama", NamaIbu = "Hidayah Sari",
                    PekerjaanAyah = "TNI", PekerjaanIbu = "Ibu Rumah Tangga",
                    PendidikanAyah = "SMA", PendidikanIbu = "SMA",
                    AlamatOrangTua = "Jl. Ahmad Yani No. 25, Kediri", NoHpWali = "081298765432",
                    TahunMasuk = "2020", AsalSekolah = "SDN 5 Kediri", KelasMasuk = "VII-C", Jurusan = "-",
                    RataRata = 78.3, PrestasiAkademik = "-",
                    CatatanKegiatan = "Aktif di kegiatan Pramuka.",
                    TahunLulus = "2023", NomorIjazah = "", NomorSkhun = "",
                    StatusKelulusan = "Lulus",
                    EmailAlumni = "", NomorHpAlumni = "",
                    PekerjaanSekarang = "Bekerja", PerguruanTinggi = "",
                    AlamatSekarang = "Jl. Ahmad Yani No. 25, Kediri",
                    StatusArsip = "Arsip Hilang"
                },
                new BukuInduk
                {
                    Id = 5, AlumniId = 5,
                    Nis = "21005", Nisn = "0021005678", NamaLengkap = "Nur Aisyah Rahmawati",
                    JenisKelamin = "P", TempatLahir = "Malang", TanggalLahir = "5 Maret 2006",
                    Agama = "Islam", Kewarganegaraan = "WNI",
                    NamaAyah = "Ahmad Syarif", NamaIbu = "Rahmawati",
                    PekerjaanAyah = "Guru", PekerjaanIbu = "PNS",
                    PendidikanAyah = "S1", PendidikanIbu = "S1",
                    AlamatOrangTua = "Jl. Diponegoro No. 3, Malang", NoHpWali = "085612345678",
                    TahunMasuk = "2021", AsalSekolah = "SDN 3 Malang", KelasMasuk = "VII-B", Jurusan = "-",
                    RataRata = 91.2, PrestasiAkademik = "Peringkat 1 Paralel Kelas IX",
                    CatatanKegiatan = "Ketua OSIS, aktif lomba sains dan debat.",
                    TahunLulus = "2024", NomorIjazah = "DN-05-7/MTs/005/2024", NomorSkhun = "SKHUN/MTs/005/2024",
                    StatusKelulusan = "Lulus",
                    EmailAlumni = "nuraisyah@email.com", NomorHpAlumni = "082198765432",
                    PekerjaanSekarang = "Mahasiswa", PerguruanTinggi = "Universitas Negeri Malang",
                    AlamatSekarang = "Jl. Semarang No. 5, Malang",
                    StatusArsip = "Lengkap"
                }
            );

            // ── Seed: Nilai Semester (for BukuInduk #1 - Ahmad Faisal) ──
            modelBuilder.Entity<NilaiSemester>().HasData(
                new NilaiSemester { Id = 1, BukuIndukId = 1, Semester = "Ganjil Kelas VII", RataRata = 86.6 },
                new NilaiSemester { Id = 2, BukuIndukId = 1, Semester = "Genap Kelas VII", RataRata = 88.4 },
                new NilaiSemester { Id = 3, BukuIndukId = 1, Semester = "Ganjil Kelas VIII", RataRata = 89.0 },
                new NilaiSemester { Id = 4, BukuIndukId = 1, Semester = "Genap Kelas VIII", RataRata = 90.4 },
                new NilaiSemester { Id = 5, BukuIndukId = 1, Semester = "Ganjil Kelas IX", RataRata = 92.0 },
                new NilaiSemester { Id = 6, BukuIndukId = 1, Semester = "Genap Kelas IX", RataRata = 93.0 },
                // BukuInduk #2 - Siti Aminah
                new NilaiSemester { Id = 7, BukuIndukId = 2, Semester = "Ganjil Kelas VII", RataRata = 89.2 },
                new NilaiSemester { Id = 8, BukuIndukId = 2, Semester = "Genap Kelas VII", RataRata = 90.2 },
                new NilaiSemester { Id = 9, BukuIndukId = 2, Semester = "Ganjil Kelas VIII", RataRata = 90.6 },
                new NilaiSemester { Id = 10, BukuIndukId = 2, Semester = "Genap Kelas VIII", RataRata = 91.6 },
                new NilaiSemester { Id = 11, BukuIndukId = 2, Semester = "Ganjil Kelas IX", RataRata = 91.0 },
                new NilaiSemester { Id = 12, BukuIndukId = 2, Semester = "Genap Kelas IX", RataRata = 92.0 }
            );

            // ── Seed: Nilai Mata Pelajaran (Semester 1 - Ahmad) ──
            modelBuilder.Entity<NilaiMataPelajaran>().HasData(
                // Semester 1 (Ganjil VII) - Ahmad
                new NilaiMataPelajaran { Id = 1, NilaiSemesterId = 1, NamaMapel = "Matematika", Nilai = 88 },
                new NilaiMataPelajaran { Id = 2, NilaiSemesterId = 1, NamaMapel = "Bahasa Indonesia", Nilai = 90 },
                new NilaiMataPelajaran { Id = 3, NilaiSemesterId = 1, NamaMapel = "IPA", Nilai = 85 },
                new NilaiMataPelajaran { Id = 4, NilaiSemesterId = 1, NamaMapel = "IPS", Nilai = 87 },
                new NilaiMataPelajaran { Id = 5, NilaiSemesterId = 1, NamaMapel = "Bahasa Inggris", Nilai = 83 },
                // Semester 2 (Genap VII) - Ahmad
                new NilaiMataPelajaran { Id = 6, NilaiSemesterId = 2, NamaMapel = "Matematika", Nilai = 90 },
                new NilaiMataPelajaran { Id = 7, NilaiSemesterId = 2, NamaMapel = "Bahasa Indonesia", Nilai = 91 },
                new NilaiMataPelajaran { Id = 8, NilaiSemesterId = 2, NamaMapel = "IPA", Nilai = 87 },
                new NilaiMataPelajaran { Id = 9, NilaiSemesterId = 2, NamaMapel = "IPS", Nilai = 89 },
                new NilaiMataPelajaran { Id = 10, NilaiSemesterId = 2, NamaMapel = "Bahasa Inggris", Nilai = 85 },
                // Semester 3 (Ganjil VIII) - Ahmad
                new NilaiMataPelajaran { Id = 11, NilaiSemesterId = 3, NamaMapel = "Matematika", Nilai = 92 },
                new NilaiMataPelajaran { Id = 12, NilaiSemesterId = 3, NamaMapel = "Bahasa Indonesia", Nilai = 89 },
                new NilaiMataPelajaran { Id = 13, NilaiSemesterId = 3, NamaMapel = "IPA", Nilai = 90 },
                new NilaiMataPelajaran { Id = 14, NilaiSemesterId = 3, NamaMapel = "IPS", Nilai = 88 },
                new NilaiMataPelajaran { Id = 15, NilaiSemesterId = 3, NamaMapel = "Bahasa Inggris", Nilai = 86 },
                // Semester 7 (Ganjil VII) - Siti
                new NilaiMataPelajaran { Id = 16, NilaiSemesterId = 7, NamaMapel = "Matematika", Nilai = 85 },
                new NilaiMataPelajaran { Id = 17, NilaiSemesterId = 7, NamaMapel = "Bahasa Indonesia", Nilai = 92 },
                new NilaiMataPelajaran { Id = 18, NilaiSemesterId = 7, NamaMapel = "IPA", Nilai = 88 },
                new NilaiMataPelajaran { Id = 19, NilaiSemesterId = 7, NamaMapel = "IPS", Nilai = 90 },
                new NilaiMataPelajaran { Id = 20, NilaiSemesterId = 7, NamaMapel = "Bahasa Inggris", Nilai = 91 }
            );

            // ── Seed: Ekstrakurikuler ──
            modelBuilder.Entity<Ekstrakurikuler>().HasData(
                // Ahmad
                new Ekstrakurikuler { Id = 1, BukuIndukId = 1, Nama = "Pramuka", Jabatan = "Ketua Regu", Tahun = "2021-2022" },
                new Ekstrakurikuler { Id = 2, BukuIndukId = 1, Nama = "Karya Ilmiah Remaja", Jabatan = "Anggota", Tahun = "2022-2023" },
                new Ekstrakurikuler { Id = 3, BukuIndukId = 1, Nama = "English Club", Jabatan = "Sekretaris", Tahun = "2023-2024" },
                // Siti
                new Ekstrakurikuler { Id = 4, BukuIndukId = 2, Nama = "PMR", Jabatan = "Ketua", Tahun = "2021-2022" },
                new Ekstrakurikuler { Id = 5, BukuIndukId = 2, Nama = "Teater", Jabatan = "Anggota", Tahun = "2022-2023" },
                // Nur Aisyah
                new Ekstrakurikuler { Id = 6, BukuIndukId = 5, Nama = "OSIS", Jabatan = "Ketua", Tahun = "2023-2024" },
                new Ekstrakurikuler { Id = 7, BukuIndukId = 5, Nama = "Olimpiade Sains", Jabatan = "Anggota", Tahun = "2022-2024" }
            );

            // ── Seed: Prestasi Lomba ──
            modelBuilder.Entity<PrestasiLomba>().HasData(
                // Ahmad
                new PrestasiLomba { Id = 1, BukuIndukId = 1, NamaLomba = "Olimpiade Matematika Tingkat Kabupaten", Tingkat = "Kabupaten", Tahun = "2022", Juara = "Juara 2" },
                new PrestasiLomba { Id = 2, BukuIndukId = 1, NamaLomba = "Lomba Karya Ilmiah Remaja", Tingkat = "Provinsi", Tahun = "2023", Juara = "Juara 3" },
                new PrestasiLomba { Id = 3, BukuIndukId = 1, NamaLomba = "Olimpiade IPA Tingkat Kota", Tingkat = "Kota", Tahun = "2024", Juara = "Juara 1" },
                // Siti
                new PrestasiLomba { Id = 4, BukuIndukId = 2, NamaLomba = "Lomba Pidato Bahasa Indonesia", Tingkat = "Kota", Tahun = "2022", Juara = "Juara 1" },
                new PrestasiLomba { Id = 5, BukuIndukId = 2, NamaLomba = "Lomba Baca Puisi Nasional", Tingkat = "Nasional", Tahun = "2023", Juara = "Finalis" },
                // Nur Aisyah
                new PrestasiLomba { Id = 6, BukuIndukId = 5, NamaLomba = "Olimpiade Sains Nasional", Tingkat = "Provinsi", Tahun = "2024", Juara = "Juara 1" }
            );
        }
    }
}
