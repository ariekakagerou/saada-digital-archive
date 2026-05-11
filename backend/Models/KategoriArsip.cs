using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlumniSmartArchive.Backend.Models
{
    [Table("kategori_arsip")]
    public class KategoriArsip
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("nama_kategori")]
        public string NamaKategori { get; set; } = string.Empty;

        [Column("deskripsi")]
        public string Deskripsi { get; set; } = string.Empty;

        [Column("dibuat_pada")]
        public DateTime DibuatPada { get; set; } = DateTime.UtcNow;
    }
}
