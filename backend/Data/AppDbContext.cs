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
        public DbSet<UserProfile> UserProfiles { get; set; }

        // ── Buku Induk Tables ──
        public DbSet<BukuInduk> BukuInduks { get; set; }
        public DbSet<NilaiSemester> NilaiSemesters { get; set; }
        public DbSet<NilaiMataPelajaran> NilaiMataPelajarans { get; set; }
        public DbSet<Ekstrakurikuler> Ekstrakurikulers { get; set; }
        public DbSet<PrestasiLomba> PrestasiLombas { get; set; }
        public DbSet<Mutasi> Mutasis { get; set; }
        // ── Fitur Tambahan (Tracer, Permohonan, Kategori) ──
        public DbSet<TracerStudy> TracerStudies { get; set; }
        public DbSet<PermohonanDokumen> PermohonanDokumens { get; set; }
        public DbSet<KategoriArsip> KategoriArsips { get; set; }
        public DbSet<Notifikasi> Notifikasi { get; set; }
        public DbSet<PesanBantuan> PesanBantuan { get; set; }

        // ── Detail Akademik & Master Mapel Tables ──
        public DbSet<MataPelajaran> MataPelajarans { get; set; }
        public DbSet<DetailIjazah> DetailIjazahs { get; set; }
        public DbSet<NilaiUjianIjazah> NilaiUjianIjazahs { get; set; }
        public DbSet<DetailSkl> DetailSkls { get; set; }
        public DbSet<NilaiUjianSkl> NilaiUjianSkls { get; set; }
        public DbSet<DetailLeggerTambahan> DetailLeggerTambahans { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ── Seed: Users ──
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Username = "ahmadfikri", FullName = "Ahmad Fikri", Email = "ahmadfikri@mts.sch.id", Nip = "198501012010011001", PasswordHash = "admin123", Role = "Admin", Active = true, DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) },
                new User { Id = 2, Username = "sitiaminah", FullName = "Siti Aminah", Email = "sitiaminah@mts.sch.id", Nip = "199001012015011001", PasswordHash = "admin123", Role = "Operator", Active = true, DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) },
                new User { Id = 3, Username = "budisantoso", FullName = "Budi Santoso", Email = "budisantoso@mts.sch.id", Nip = "199201012016011001", PasswordHash = "admin123", Role = "Penulis", Active = true, DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) },
                new User { Id = 4, Username = "superuser", FullName = "Super Administrator", Email = "super@mts.sch.id", Nip = "198001011995011001", PasswordHash = "admin123", Role = "AdminSuper", Active = true, DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) },
                new User { Id = 5, Username = "alumnidemo", FullName = "Ahmad Faisal Ramadhan", Email = "alumni@mts.sch.id", Nip = "0021001234", PasswordHash = "alumni123", Role = "Alumni", AlumniId = 1, Active = true, DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) }
            );

            // ── Seed: User Profiles (Menyimpan Jabatan Staff) ──
            modelBuilder.Entity<UserProfile>().HasData(
                new UserProfile { Id = 1, UserId = 1, Jabatan = "Kepala Pengarsipan", UpdatedAt = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) },
                new UserProfile { Id = 2, UserId = 2, Jabatan = "Petugas Digitalisasi", UpdatedAt = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) },
                new UserProfile { Id = 3, UserId = 3, Jabatan = "Penulis Buku Induk", UpdatedAt = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) },
                new UserProfile { Id = 4, UserId = 4, Jabatan = "Super Administrator Utama", UpdatedAt = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) },
                new UserProfile { Id = 5, UserId = 5, Nisn = "0021001234", Jabatan = "Alumni", TahunLulus = "2024", StatusAlumni = "Aktif", UpdatedAt = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) }
            );

            // ── Seed: Alumni ──
            modelBuilder.Entity<Alumni>().HasData(
                new Alumni { Id = 1, FullName = "Ahmad Faisal Ramadhan", Nisn = "0021001234", Nis = "21001", JenisKelamin = "L", TempatLahir = "Malang", GraduationYear = 2024, BirthDate = new DateTime(2005, 2, 10), Address = "Jl. Veteran No. 45, Malang", DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 2, FullName = "Siti Aminah Putri", Nisn = "0021002345", Nis = "21002", JenisKelamin = "P", TempatLahir = "Surabaya", GraduationYear = 2023, BirthDate = new DateTime(2006, 5, 15), Address = "Jl. Merdeka No. 10, Surabaya", DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 3, FullName = "Dewi Lestari", Nisn = "0021003456", Nis = "21003", JenisKelamin = "P", TempatLahir = "Blitar", GraduationYear = 2024, BirthDate = new DateTime(2006, 7, 10), Address = "Jl. Kenanga No. 8, Blitar", DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 4, FullName = "Muhammad Rizky Hidayat", Nisn = "0021004567", Nis = "21004", JenisKelamin = "L", TempatLahir = "Kediri", GraduationYear = 2023, BirthDate = new DateTime(2005, 11, 20), Address = "Jl. Ahmad Yani No. 25, Kediri", DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 5, FullName = "Nur Aisyah Rahmawati", Nisn = "0021005678", Nis = "21005", JenisKelamin = "P", TempatLahir = "Malang", GraduationYear = 2024, BirthDate = new DateTime(2006, 3, 5), Address = "Jl. Diponegoro No. 3, Malang", DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) }
            );

            // ── Seed: Mata Pelajaran ──
            modelBuilder.Entity<MataPelajaran>().HasData(
                new MataPelajaran { Id = 1, KodeMapel = "QH", NamaMapel = "Al-Qur'an Hadis", Kategori = "Agama", DibuatPada = new DateTime(2026, 6, 27, 0, 0, 0, DateTimeKind.Utc) },
                new MataPelajaran { Id = 2, KodeMapel = "AA", NamaMapel = "Akidah Akhlak", Kategori = "Agama", DibuatPada = new DateTime(2026, 6, 27, 0, 0, 0, DateTimeKind.Utc) },
                new MataPelajaran { Id = 3, KodeMapel = "FIK", NamaMapel = "Fikih", Kategori = "Agama", DibuatPada = new DateTime(2026, 6, 27, 0, 0, 0, DateTimeKind.Utc) },
                new MataPelajaran { Id = 4, KodeMapel = "SKI", NamaMapel = "Sejarah Kebudayaan Islam", Kategori = "Agama", DibuatPada = new DateTime(2026, 6, 27, 0, 0, 0, DateTimeKind.Utc) },
                new MataPelajaran { Id = 5, KodeMapel = "PPKn", NamaMapel = "Pendidikan Pancasila dan Kewarganegaraan", Kategori = "Umum", DibuatPada = new DateTime(2026, 6, 27, 0, 0, 0, DateTimeKind.Utc) },
                new MataPelajaran { Id = 6, KodeMapel = "BIND", NamaMapel = "Bahasa Indonesia", Kategori = "Umum", DibuatPada = new DateTime(2026, 6, 27, 0, 0, 0, DateTimeKind.Utc) },
                new MataPelajaran { Id = 7, KodeMapel = "BAR", NamaMapel = "Bahasa Arab", Kategori = "Umum", DibuatPada = new DateTime(2026, 6, 27, 0, 0, 0, DateTimeKind.Utc) },
                new MataPelajaran { Id = 8, KodeMapel = "MTK", NamaMapel = "Matematika", Kategori = "Umum", DibuatPada = new DateTime(2026, 6, 27, 0, 0, 0, DateTimeKind.Utc) },
                new MataPelajaran { Id = 9, KodeMapel = "IPA", NamaMapel = "Ilmu Pengetahuan Alam", Kategori = "Umum", DibuatPada = new DateTime(2026, 6, 27, 0, 0, 0, DateTimeKind.Utc) },
                new MataPelajaran { Id = 10, KodeMapel = "IPS", NamaMapel = "Ilmu Pengetahuan Sosial", Kategori = "Umum", DibuatPada = new DateTime(2026, 6, 27, 0, 0, 0, DateTimeKind.Utc) },
                new MataPelajaran { Id = 11, KodeMapel = "BING", NamaMapel = "Bahasa Inggris", Kategori = "Umum", DibuatPada = new DateTime(2026, 6, 27, 0, 0, 0, DateTimeKind.Utc) },
                new MataPelajaran { Id = 12, KodeMapel = "SB", NamaMapel = "Seni Budaya", Kategori = "Umum", DibuatPada = new DateTime(2026, 6, 27, 0, 0, 0, DateTimeKind.Utc) },
                new MataPelajaran { Id = 13, KodeMapel = "PJOK", NamaMapel = "Pendidikan Jasmani, Olahraga, dan Kesehatan", Kategori = "Umum", DibuatPada = new DateTime(2026, 6, 27, 0, 0, 0, DateTimeKind.Utc) },
                new MataPelajaran { Id = 14, KodeMapel = "PRKTI", NamaMapel = "Prakarya dan Informatika", Kategori = "Umum", DibuatPada = new DateTime(2026, 6, 27, 0, 0, 0, DateTimeKind.Utc) },
                new MataPelajaran { Id = 15, KodeMapel = "BSND", NamaMapel = "Muatan Lokal Bahasa Sunda", Kategori = "Muatan Lokal", DibuatPada = new DateTime(2026, 6, 27, 0, 0, 0, DateTimeKind.Utc) },
                new MataPelajaran { Id = 16, KodeMapel = "BTHQ", NamaMapel = "Muatan Lokal Baca Tulis dan Hafalan Al-Qur'an", Kategori = "Muatan Lokal", DibuatPada = new DateTime(2026, 6, 27, 0, 0, 0, DateTimeKind.Utc) }
            );

            // ── Seed: Kategori Arsip ──
            modelBuilder.Entity<KategoriArsip>().HasData(
                new KategoriArsip { Id = 1, NamaKategori = "Ijazah", Deskripsi = "Sertifikat tanda tamat belajar", DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) },
                new KategoriArsip { Id = 2, NamaKategori = "SKL (Surat Keterangan Lulus)", Deskripsi = "Surat Keterangan Lulus", DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) },
                new KategoriArsip { Id = 3, NamaKategori = "Rapor", Deskripsi = "Buku laporan pendidikan", DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) },
                new KategoriArsip { Id = 4, NamaKategori = "Buku Induk", Deskripsi = "Halaman detail buku induk siswa", DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) }
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
                    StatusSiswa = "Lulus",
                    EmailAlumni = "ahmadfaisal@email.com", NomorHpAlumni = "082345678901",
                    PekerjaanSekarang = "Mahasiswa", PerguruanTinggi = "Universitas Brawijaya Malang",
                    AlamatSekarang = "Jl. MT. Haryono No. 165, Malang",
                    StatusArsip = "Lengkap",
                    DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc),
                    DiperbaruiPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc)
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
                    StatusSiswa = "Lulus",
                    EmailAlumni = "sitiaminah@email.com", NomorHpAlumni = "089012345678",
                    PekerjaanSekarang = "Mahasiswa", PerguruanTinggi = "Universitas Airlangga Surabaya",
                    AlamatSekarang = "Jl. Dharmawangsa No. 5, Surabaya",
                    StatusArsip = "Lengkap",
                    DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc),
                    DiperbaruiPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc)
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
                    StatusSiswa = "Lulus",
                    EmailAlumni = "", NomorHpAlumni = "081234000111",
                    PekerjaanSekarang = "", PerguruanTinggi = "",
                    AlamatSekarang = "Jl. Kenanga No. 8, Blitar",
                    StatusArsip = "Belum Lengkap",
                    DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc),
                    DiperbaruiPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc)
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
                    StatusSiswa = "Lulus",
                    EmailAlumni = "", NomorHpAlumni = "",
                    PekerjaanSekarang = "Bekerja", PerguruanTinggi = "",
                    AlamatSekarang = "Jl. Ahmad Yani No. 25, Kediri",
                    StatusArsip = "Arsip Hilang",
                    DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc),
                    DiperbaruiPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc)
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
                    CatatanKegiatan = "Ketua OSIS, aktif lomba sains and debat.",
                    TahunLulus = "2024", NomorIjazah = "DN-05-7/MTs/005/2024", NomorSkhun = "SKHUN/MTs/005/2024",
                    StatusSiswa = "Lulus",
                    EmailAlumni = "nuraisyah@email.com", NomorHpAlumni = "082198765432",
                    PekerjaanSekarang = "Mahasiswa", PerguruanTinggi = "Universitas Negeri Malang",
                    AlamatSekarang = "Jl. Semarang No. 5, Malang",
                    StatusArsip = "Lengkap",
                    DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc),
                    DiperbaruiPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc)
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

            // ── Seed: Alumni Kelas IX-B TA 2023-2024 (Data dari Daftar Pengambilan Raport) ──
            modelBuilder.Entity<Alumni>().HasData(
                new Alumni { Id = 6,  FullName = "Ahmad Danial Madaris",       Nisn = "0094032702", Nis = "210004", JenisKelamin = "L", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 7,  FullName = "Alpia Dwi",                  Nisn = "3029821030", Nis = "210016", JenisKelamin = "P", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 8,  FullName = "Alpian Tri Saputra",         Nisn = "0095131024", Nis = "210015", JenisKelamin = "L", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 9,  FullName = "Alya Nur Rahman",            Nisn = "0098551698", Nis = "210019", JenisKelamin = "P", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 10, FullName = "Amanda Nur Fitriyanti",      Nisn = "0084547605", Nis = "220178", JenisKelamin = "P", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 11, FullName = "Audya Aryanti Purnama",      Nisn = "0087413631", Nis = "210026", JenisKelamin = "P", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 12, FullName = "Eko Pratomo",                Nisn = "0096613462", Nis = "210041", JenisKelamin = "L", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 13, FullName = "Emil Dwi Saputra",           Nisn = "0094081702", Nis = "210042", JenisKelamin = "L", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 14, FullName = "Fachry Anwar",               Nisn = "0040243855", Nis = "210048", JenisKelamin = "L", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 15, FullName = "Farid Dika Agus Saputra",    Nisn = "0085003724", Nis = "210055", JenisKelamin = "L", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 16, FullName = "Frida Hendrawati",           Nisn = "0092420290", Nis = "210061", JenisKelamin = "P", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 17, FullName = "Indah Maulida",              Nisn = "0099677891", Nis = "210065", JenisKelamin = "P", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 18, FullName = "Jhan Bunga Lestari",         Nisn = "0088129632", Nis = "210174", JenisKelamin = "P", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 19, FullName = "Kiara Shafa Azzahra",        Nisn = "0095126569", Nis = "210067", JenisKelamin = "P", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 20, FullName = "Luna Amelia",                Nisn = "0092088443", Nis = "210071", JenisKelamin = "P", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 21, FullName = "M. Ardiansyah",              Nisn = "0082839608", Nis = "210084", JenisKelamin = "L", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 22, FullName = "Maharani",                   Nisn = "0082573905", Nis = "210179", JenisKelamin = "P", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 23, FullName = "Maudy Shafitri",             Nisn = "0082573391", Nis = "210080", JenisKelamin = "P", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 24, FullName = "Maulana Arlan Firmansyah",   Nisn = "0093869103", Nis = "210163", JenisKelamin = "L", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 25, FullName = "Meliana",                    Nisn = "0061033508", Nis = "210081", JenisKelamin = "P", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 26, FullName = "Muhammad Ardan Supriatna",   Nisn = "0034813013", Nis = "210164", JenisKelamin = "L", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 27, FullName = "Muhammad Fahri Nursandi",    Nisn = "0085100545", Nis = "210086", JenisKelamin = "L", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 28, FullName = "Muhammad Fazri Ramdhani",    Nisn = "0097772930", Nis = "210088", JenisKelamin = "L", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 29, FullName = "Muhammad Septian Ramadhan",  Nisn = "0072536428", Nis = "210094", JenisKelamin = "L", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 30, FullName = "Naufal Az Zuhdi",            Nisn = "0072693904", Nis = "210104", JenisKelamin = "L", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 31, FullName = "Putri Ariskha",              Nisn = "0097743162", Nis = "210110", JenisKelamin = "P", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 32, FullName = "Quenna Valencia",            Nisn = "0087189022", Nis = "210111", JenisKelamin = "P", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 33, FullName = "Rafady Faetza",              Nisn = "0084683986", Nis = "210114", JenisKelamin = "L", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 34, FullName = "Raisya Fauziah",             Nisn = "0098703244", Nis = "210116", JenisKelamin = "P", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 35, FullName = "Rehan Alfahrezi",            Nisn = "0096359612", Nis = "210121", JenisKelamin = "L", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 36, FullName = "Rendi Bagaskara",            Nisn = "0075509860", Nis = "210123", JenisKelamin = "L", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 37, FullName = "Rendy Alfiano",              Nisn = "0094094143", Nis = "210168", JenisKelamin = "L", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 38, FullName = "Reza Perdana Hakim",         Nisn = "0082816477", Nis = "210127", JenisKelamin = "L", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 39, FullName = "Rezita Gestiyanti",          Nisn = "0084172704", Nis = "210128", JenisKelamin = "P", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 40, FullName = "Ririn Alpiana",              Nisn = "0084380378", Nis = "210132", JenisKelamin = "P", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 41, FullName = "Rizki Arafah",               Nisn = "0097621952", Nis = "210134", JenisKelamin = "P", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 42, FullName = "Salsabila",                  Nisn = "0092409057", Nis = "210136", JenisKelamin = "P", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new Alumni { Id = 43, FullName = "Salwa",                      Nisn = "0084142408", Nis = "210137", JenisKelamin = "P", TempatLahir = "",  GraduationYear = 2024, DibuatPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) }
            );

            // ── Seed: Tracer Study Kelas IX-B 2024 (Sekolah Lanjutan dari Kolom "Ket") ──
            // Status: "Melanjutkan ke SMA/SMK" = alumni MTs yang meneruskan ke jenjang menengah atas
            modelBuilder.Entity<TracerStudy>().HasData(
                new TracerStudy { Id = 1,  AlumniId = 6,  StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "Sekolah Nusantara",      JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 2,  AlumniId = 7,  StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMK Palupah",              JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 3,  AlumniId = 8,  StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMA 3 Cibinong",           JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 4,  AlumniId = 9,  StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMK Master",                JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 5,  AlumniId = 10, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMK Paci 3",                JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 6,  AlumniId = 11, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMAN 2 Bogor",              JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 7,  AlumniId = 12, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMAN 2 Bogor",              JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 8,  AlumniId = 13, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMK Master",                JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 9,  AlumniId = 14, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMK Sirnawati",             JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 10, AlumniId = 15, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMK Sirnawati",             JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 11, AlumniId = 16, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMK Nasarports",            JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 12, AlumniId = 17, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SIKER 2 Bogor",             JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 13, AlumniId = 18, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMK RG13",                  JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 14, AlumniId = 19, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMK Pari 3",                JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 15, AlumniId = 20, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMK Nusantara",             JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 16, AlumniId = 21, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMK Nusantara",             JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 17, AlumniId = 22, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMKN 1 Cibinong",           JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 18, AlumniId = 23, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMPN Pari 3",               JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024 (perlu verifikasi)", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 19, AlumniId = 24, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMK Master",                JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 20, AlumniId = 25, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMK Pari 3",                JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 21, AlumniId = 26, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMAN 2 Bogor",              JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 22, AlumniId = 27, StatusSaatIni = "Tidak Diketahui",         NamaInstansi = "",                          JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024 (kolom ket kosong)", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 23, AlumniId = 28, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMK Nusantara",             JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 24, AlumniId = 29, StatusSaatIni = "Tidak Diketahui",         NamaInstansi = "",                          JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024 (kolom ket kosong)", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 25, AlumniId = 30, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMAN 8 Bogor",              JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 26, AlumniId = 31, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMK Kertahesna Cisa",       JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 27, AlumniId = 32, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMAN 2 Cibinong",           JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 28, AlumniId = 33, StatusSaatIni = "Tidak Diketahui",         NamaInstansi = "",                          JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024 (kolom ket kosong)", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 29, AlumniId = 34, StatusSaatIni = "Tidak Diketahui",         NamaInstansi = "",                          JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024 (kolom ket kosong)", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 30, AlumniId = 35, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMF Pari 1",                JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 31, AlumniId = 36, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMK Al-Iqra",               JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 32, AlumniId = 37, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SHK BD",                    JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024 (perlu verifikasi nama sekolah)", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 33, AlumniId = 38, StatusSaatIni = "Tidak Diketahui",         NamaInstansi = "",                          JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024 (kolom ket kosong)", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 34, AlumniId = 39, StatusSaatIni = "Tidak Diketahui",         NamaInstansi = "",                          JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024 (kolom ket kosong)", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 35, AlumniId = 40, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMK Pari 3",                JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 36, AlumniId = 41, StatusSaatIni = "Melanjutkan ke SMA/SMK", NamaInstansi = "SMK Alati",                 JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 37, AlumniId = 42, StatusSaatIni = "Tidak Diketahui",         NamaInstansi = "",                          JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024 (kolom ket kosong)", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) },
                new TracerStudy { Id = 38, AlumniId = 43, StatusSaatIni = "Tidak Diketahui",         NamaInstansi = "",                          JabatanAtauJurusan = "",  TahunMulai = "2024", CatatanTambahan = "Kelas IX-B TA 2023-2024 (kolom ket kosong)", DiperbaruiPada = new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc) }
            );

            // ── Seed: Detail Ijazah ──
            modelBuilder.Entity<DetailIjazah>().HasData(
                new DetailIjazah { Id = 1, AlumniId = 1, TanggalPenerbitan = new DateTime(2024, 6, 15, 0, 0, 0, DateTimeKind.Utc), NamaKepalaMadrasah = "Drs. H. Ahmad Fauzi, M.Pd.I", RataRataNilai = 86.25, DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) },
                new DetailIjazah { Id = 2, AlumniId = 2, TanggalPenerbitan = new DateTime(2023, 6, 15, 0, 0, 0, DateTimeKind.Utc), NamaKepalaMadrasah = "Drs. H. Ahmad Fauzi, M.Pd.I", RataRataNilai = 84.75, DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) }
            );

            // ── Seed: Nilai Ujian Ijazah ──
            modelBuilder.Entity<NilaiUjianIjazah>().HasData(
                new NilaiUjianIjazah { Id = 1, DetailIjazahId = 1, MataPelajaranId = 1, Nilai = 88 },
                new NilaiUjianIjazah { Id = 2, DetailIjazahId = 1, MataPelajaranId = 6, Nilai = 87 },
                new NilaiUjianIjazah { Id = 3, DetailIjazahId = 1, MataPelajaranId = 8, Nilai = 84 },
                new NilaiUjianIjazah { Id = 4, DetailIjazahId = 1, MataPelajaranId = 9, Nilai = 86 },
                new NilaiUjianIjazah { Id = 5, DetailIjazahId = 2, MataPelajaranId = 1, Nilai = 85 },
                new NilaiUjianIjazah { Id = 6, DetailIjazahId = 2, MataPelajaranId = 6, Nilai = 86 },
                new NilaiUjianIjazah { Id = 7, DetailIjazahId = 2, MataPelajaranId = 8, Nilai = 80 },
                new NilaiUjianIjazah { Id = 8, DetailIjazahId = 2, MataPelajaranId = 9, Nilai = 88 }
            );

            // ── Seed: Detail SKL ──
            modelBuilder.Entity<DetailSkl>().HasData(
                new DetailSkl { Id = 1, AlumniId = 1, NomorPeserta = "03-001-024-9", TanggalTerbit = new DateTime(2024, 6, 10, 0, 0, 0, DateTimeKind.Utc), RataRataNilai = 87.5, DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) },
                new DetailSkl { Id = 2, AlumniId = 2, NomorPeserta = "03-001-025-8", TanggalTerbit = new DateTime(2023, 6, 10, 0, 0, 0, DateTimeKind.Utc), RataRataNilai = 85.0, DibuatPada = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) }
            );

            // ── Seed: Nilai Ujian SKL ──
            modelBuilder.Entity<NilaiUjianSkl>().HasData(
                new NilaiUjianSkl { Id = 1, DetailSklId = 1, MataPelajaranId = 1, Nilai = 90 },
                new NilaiUjianSkl { Id = 2, DetailSklId = 1, MataPelajaranId = 6, Nilai = 88 },
                new NilaiUjianSkl { Id = 3, DetailSklId = 1, MataPelajaranId = 8, Nilai = 85 },
                new NilaiUjianSkl { Id = 4, DetailSklId = 1, MataPelajaranId = 9, Nilai = 87 },
                new NilaiUjianSkl { Id = 5, DetailSklId = 2, MataPelajaranId = 1, Nilai = 86 },
                new NilaiUjianSkl { Id = 6, DetailSklId = 2, MataPelajaranId = 6, Nilai = 87 },
                new NilaiUjianSkl { Id = 7, DetailSklId = 2, MataPelajaranId = 8, Nilai = 82 },
                new NilaiUjianSkl { Id = 8, DetailSklId = 2, MataPelajaranId = 9, Nilai = 85 }
            );
        }
    }
}
