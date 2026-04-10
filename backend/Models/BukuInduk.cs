using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlumniSmartArchive.Backend.Models
{
    [Table("buku_induk")]
    public class BukuInduk
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("alumni_id")]
        public int AlumniId { get; set; }

        // ── 1. Identitas Siswa ──
        [Column("nis")]
        public string Nis { get; set; } = string.Empty;

        [Column("nisn")]
        public string Nisn { get; set; } = string.Empty;

        [Column("nama_lengkap")]
        public string NamaLengkap { get; set; } = string.Empty;

        [Column("jenis_kelamin")]
        public string JenisKelamin { get; set; } = "L"; // "L" or "P"

        [Column("tempat_lahir")]
        public string TempatLahir { get; set; } = string.Empty;

        [Column("tanggal_lahir")]
        public string TanggalLahir { get; set; } = string.Empty;

        [Column("agama")]
        public string Agama { get; set; } = "Islam";

        [Column("kewarganegaraan")]
        public string Kewarganegaraan { get; set; } = "WNI";

        // ── 2. Data Keluarga ──
        [Column("nama_ayah")]
        public string NamaAyah { get; set; } = string.Empty;

        [Column("nama_ibu")]
        public string NamaIbu { get; set; } = string.Empty;

        [Column("pekerjaan_ayah")]
        public string PekerjaanAyah { get; set; } = string.Empty;

        [Column("pekerjaan_ibu")]
        public string PekerjaanIbu { get; set; } = string.Empty;

        [Column("pendidikan_ayah")]
        public string PendidikanAyah { get; set; } = string.Empty;

        [Column("pendidikan_ibu")]
        public string PendidikanIbu { get; set; } = string.Empty;

        [Column("alamat_orang_tua")]
        public string AlamatOrangTua { get; set; } = string.Empty;

        [Column("no_hp_wali")]
        public string NoHpWali { get; set; } = string.Empty;

        // ── 3. Data Sekolah ──
        [Column("tahun_masuk")]
        public string TahunMasuk { get; set; } = string.Empty;

        [Column("asal_sekolah")]
        public string AsalSekolah { get; set; } = string.Empty;

        [Column("kelas_masuk")]
        public string KelasMasuk { get; set; } = string.Empty;

        [Column("jurusan")]
        public string Jurusan { get; set; } = "-";

        // ── 4. Data Akademik ──
        [Column("rata_rata")]
        public double RataRata { get; set; }

        [Column("prestasi_akademik")]
        public string PrestasiAkademik { get; set; } = string.Empty;

        // ── 5. Data Non Akademik ──
        [Column("catatan_kegiatan")]
        public string CatatanKegiatan { get; set; } = string.Empty;

        // ── 6. Data Kelulusan ──
        [Column("tahun_lulus")]
        public string TahunLulus { get; set; } = string.Empty;

        [Column("nomor_ijazah")]
        public string NomorIjazah { get; set; } = string.Empty;

        [Column("nomor_skhun")]
        public string NomorSkhun { get; set; } = string.Empty;

        [Column("status_kelulusan")]
        public string StatusKelulusan { get; set; } = "Lulus"; // "Lulus", "Mutasi", "Pindah"

        // ── 7. Data Alumni (Pasca Lulus) ──
        [Column("email_alumni")]
        public string EmailAlumni { get; set; } = string.Empty;

        [Column("nomor_hp_alumni")]
        public string NomorHpAlumni { get; set; } = string.Empty;

        [Column("pekerjaan_sekarang")]
        public string PekerjaanSekarang { get; set; } = string.Empty;

        [Column("perguruan_tinggi")]
        public string PerguruanTinggi { get; set; } = string.Empty;

        [Column("alamat_sekarang")]
        public string AlamatSekarang { get; set; } = string.Empty;

        // ── Meta ──
        [Column("status_arsip")]
        public string StatusArsip { get; set; } = "Belum Lengkap"; // "Lengkap", "Belum Lengkap", "Arsip Hilang"

        [Column("foto")]
        public string? Foto { get; set; }

        [Column("dibuat_pada")]
        public DateTime DibuatPada { get; set; } = DateTime.UtcNow;

        [Column("diperbarui_pada")]
        public DateTime DiperbaruiPada { get; set; } = DateTime.UtcNow;

        // ── Navigation Properties ──
        [ForeignKey("AlumniId")]
        public Alumni? Alumni { get; set; }

        public ICollection<NilaiSemester> NilaiSemesters { get; set; } = new List<NilaiSemester>();
        public ICollection<Ekstrakurikuler> Ekstrakurikulers { get; set; } = new List<Ekstrakurikuler>();
        public ICollection<PrestasiLomba> PrestasiLombas { get; set; } = new List<PrestasiLomba>();
    }

    [Table("nilai_semester")]
    public class NilaiSemester
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("buku_induk_id")]
        public int BukuIndukId { get; set; }

        [Column("semester")]
        public string Semester { get; set; } = string.Empty; // "Ganjil Kelas VII", etc.

        [Column("rata_rata")]
        public double RataRata { get; set; }

        // Navigation
        [ForeignKey("BukuIndukId")]
        public BukuInduk? BukuInduk { get; set; }

        public ICollection<NilaiMataPelajaran> NilaiMataPelajarans { get; set; } = new List<NilaiMataPelajaran>();
    }

    [Table("nilai_mata_pelajaran")]
    public class NilaiMataPelajaran
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("nilai_semester_id")]
        public int NilaiSemesterId { get; set; }

        [Column("nama_mapel")]
        public string NamaMapel { get; set; } = string.Empty;

        [Column("nilai")]
        public int Nilai { get; set; }

        [ForeignKey("NilaiSemesterId")]
        public NilaiSemester? NilaiSemester { get; set; }
    }

    [Table("ekstrakurikuler")]
    public class Ekstrakurikuler
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("buku_induk_id")]
        public int BukuIndukId { get; set; }

        [Column("nama")]
        public string Nama { get; set; } = string.Empty;

        [Column("jabatan")]
        public string Jabatan { get; set; } = string.Empty;

        [Column("tahun")]
        public string Tahun { get; set; } = string.Empty;

        [ForeignKey("BukuIndukId")]
        public BukuInduk? BukuInduk { get; set; }
    }

    [Table("prestasi_lomba")]
    public class PrestasiLomba
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("buku_induk_id")]
        public int BukuIndukId { get; set; }

        [Column("nama_lomba")]
        public string NamaLomba { get; set; } = string.Empty;

        [Column("tingkat")]
        public string Tingkat { get; set; } = string.Empty; // "Kota", "Kabupaten", "Provinsi", "Nasional"

        [Column("tahun")]
        public string Tahun { get; set; } = string.Empty;

        [Column("juara")]
        public string Juara { get; set; } = string.Empty;

        [ForeignKey("BukuIndukId")]
        public BukuInduk? BukuInduk { get; set; }
    }
}
