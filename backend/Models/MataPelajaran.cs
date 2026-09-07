using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlumniSmartArchive.Backend.Models
{
    [Table("mata_pelajaran")]
    public class MataPelajaran
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("kode_mapel")]
        public string KodeMapel { get; set; } = string.Empty;

        [Required]
        [Column("nama_mapel")]
        public string NamaMapel { get; set; } = string.Empty;

        [Column("kategori")]
        public string Kategori { get; set; } = "Umum"; // e.g. Agama, Umum, Muatan Lokal

        [Column("dibuat_pada")]
        public DateTime DibuatPada { get; set; } = DateTime.UtcNow;
    }
}
