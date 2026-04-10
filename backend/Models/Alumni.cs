using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlumniSmartArchive.Backend.Models
{
    [Table("alumni")]
    public class Alumni
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("nisn")]
        public string Nisn { get; set; } = string.Empty;

        [Column("nis")]
        public string Nis { get; set; } = string.Empty;

        [Column("nama_lengkap")]
        public string FullName { get; set; } = string.Empty;

        [Column("jenis_kelamin")]
        public string JenisKelamin { get; set; } = "L";

        [Column("tempat_lahir")]
        public string TempatLahir { get; set; } = string.Empty;

        [Column("tahun_lulus")]
        public int GraduationYear { get; set; }

        [Column("tanggal_lahir")]
        public DateTime? BirthDate { get; set; }

        [Column("alamat")]
        public string Address { get; set; } = string.Empty;

        [Column("dibuat_pada")]
        public DateTime DibuatPada { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<BukuInduk> BukuInduks { get; set; } = new List<BukuInduk>();
        public ICollection<Mutasi> Mutasis { get; set; } = new List<Mutasi>();
    }
}
