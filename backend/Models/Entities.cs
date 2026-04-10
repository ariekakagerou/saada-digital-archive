using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlumniSmartArchive.Backend.Models
{
    [Table("pengguna")]
    public class User
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Required]
        [Column("nama_pengguna")]
        public string Username { get; set; } = string.Empty;

        [Column("nama_lengkap")]
        public string FullName { get; set; } = string.Empty;

        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Column("nip")]
        public string Nip { get; set; } = string.Empty;
        
        [Required]
        [Column("kata_sandi")]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Column("peran")]
        public string Role { get; set; } = "Operator"; // Operator, Penulis, Admin, AdminSuper

        [Column("aktif")]
        public bool Active { get; set; } = true;

        [Column("dibuat_pada")]
        public DateTime DibuatPada { get; set; } = DateTime.UtcNow;
    }

    [Table("arsip")]
    public class Archive
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("alumni_id")]
        public int? AlumniId { get; set; }

        [Required]
        [Column("lokasi_file")]
        public string FilePath { get; set; } = string.Empty;
        
        [Column("tipe_file")]
        public string FileType { get; set; } = "Gambar"; // Gambar, PDF

        [Column("jenis_arsip")]
        public string JenisArsip { get; set; } = "Ijazah"; // Ijazah, SKHU, Transkrip, Rapor, Buku Induk

        [Column("status_arsip")]
        public string StatusArsip { get; set; } = "Belum Lengkap"; // Lengkap, Belum Lengkap, Arsip Hilang

        [Column("ukuran_file")]
        public long UkuranFile { get; set; }

        [Column("pengunggah")]
        public string Pengunggah { get; set; } = string.Empty;

        [Column("diunggah_pada")]
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("AlumniId")]
        public Alumni? Alumni { get; set; }
        
        public OcrResult? OcrResult { get; set; }
    }

    [Table("hasil_ocr")]
    public class OcrResult
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("arsip_id")]
        public int ArchiveId { get; set; }
        
        [Column("teks_ekstraksi")]
        public string ExtractedText { get; set; } = string.Empty;
        
        [Column("skor_akurasi")]
        public double ConfidenceScore { get; set; }
        
        [Column("status")]
        public string Status { get; set; } = "Menunggu"; // Menunggu, Selesai, Ditinjau

        [ForeignKey("ArchiveId")]
        public Archive? Archive { get; set; }
    }

    [Table("log_aktivitas")]
    public class LogAktivitas
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("pengguna_id")]
        public int? PenggunaId { get; set; }

        [Column("nama_pengguna")]
        public string NamaPengguna { get; set; } = string.Empty;

        [Column("aksi")]
        public string Aksi { get; set; } = string.Empty;

        [Column("target_objek")]
        public string TargetObjek { get; set; } = string.Empty;

        [Column("status")]
        public string Status { get; set; } = "Sukses";

        [Column("ip_address")]
        public string IpAddress { get; set; } = string.Empty;

        [Column("waktu")]
        public DateTime Waktu { get; set; } = DateTime.UtcNow;

        [ForeignKey("PenggunaId")]
        public User? Pengguna { get; set; }
    }
}
