using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AlumniSmartArchive.Backend.Models
{
    [Table("profil_pengguna")]
    public class UserProfile
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("pengguna_id")]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        [JsonIgnore]
        public User? User { get; set; }

        // --- Data Pribadi ---
        [Column("no_hp")]
        public string? Phone { get; set; }

        [Column("nik")]
        public string? Nik { get; set; }

        [Column("jenis_kelamin")]
        public string? Gender { get; set; } // Laki-laki / Perempuan

        [Column("tempat_tanggal_lahir")]
        public string? BirthPlaceDate { get; set; }

        [Column("alamat_lengkap")]
        public string? Address { get; set; }

        [Column("kota")]
        public string? City { get; set; }

        [Column("provinsi")]
        public string? Province { get; set; }

        [Column("kode_pos")]
        public string? PostalCode { get; set; }

        // --- Informasi Akademik ---
        [Column("nisn")]
        public string? Nisn { get; set; }

        [Column("tahun_masuk")]
        public string? TahunMasuk { get; set; }

        [Column("tahun_lulus")]
        public string? TahunLulus { get; set; }

        [Column("jurusan")]
        public string? Jurusan { get; set; }

        [Column("angkatan")]
        public string? Angkatan { get; set; }

        [Column("status_alumni")]
        public string? StatusAlumni { get; set; }

        [Column("unit_lembaga")]
        public string? UnitLembaga { get; set; }

        [Column("jabatan")]
        public string? Jabatan { get; set; }

        // --- Kontak Darurat ---
        [Column("darurat_nama")]
        public string? EmergencyName { get; set; }

        [Column("darurat_hubungan")]
        public string? EmergencyRelation { get; set; }

        [Column("darurat_no_hp")]
        public string? EmergencyPhone { get; set; }

        // --- Media Sosial ---
        [Column("facebook")]
        public string? Facebook { get; set; }

        [Column("instagram")]
        public string? Instagram { get; set; }

        [Column("linkedin")]
        public string? LinkedIn { get; set; }

        [Column("website")]
        public string? Website { get; set; }

        // --- Avatar / Foto Profil ---
        [Column("avatar_url", TypeName = "longtext")]
        public string? AvatarUrl { get; set; }

        [Column("diperbarui_pada")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
