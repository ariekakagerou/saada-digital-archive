using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlumniSmartArchive.Backend.Models
{
    [Table("detail_skl")]
    public class DetailSkl
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("alumni_id")]
        public int AlumniId { get; set; }


        [Column("nomor_peserta")]
        public string NomorPeserta { get; set; } = string.Empty;

        [Column("tanggal_terbit")]
        public DateTime? TanggalTerbit { get; set; }

        [Column("rata_rata_nilai")]
        public double RataRataNilai { get; set; }

        [Column("dibuat_pada")]
        public DateTime DibuatPada { get; set; } = DateTime.UtcNow;

        [ForeignKey("AlumniId")]
        public Alumni? Alumni { get; set; }

        public ICollection<NilaiUjianSkl> NilaiUjianSkls { get; set; } = new List<NilaiUjianSkl>();
    }
}
