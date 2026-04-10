using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlumniSmartArchive.Backend.Models
{
    [Table("mutasi")]
    public class Mutasi
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("alumni_id")]
        public int AlumniId { get; set; }

        [Required]
        [Column("jenis_mutasi")]
        public string JenisMutasi { get; set; } = "Masuk"; // Masuk, Keluar

        [Column("tanggal_mutasi")]
        public DateTime TanggalMutasi { get; set; }

        [Column("sekolah_asal_tujuan")]
        public string SekolahAsalTujuan { get; set; } = string.Empty;

        [Column("alasan_mutasi")]
        public string AlasanMutasi { get; set; } = string.Empty;

        [ForeignKey("AlumniId")]
        public Alumni? Alumni { get; set; }
    }
}
