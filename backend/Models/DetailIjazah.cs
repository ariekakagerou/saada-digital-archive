using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlumniSmartArchive.Backend.Models
{
    [Table("detail_ijazah")]
    public class DetailIjazah
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("alumni_id")]
        public int AlumniId { get; set; }


        [Column("tanggal_penerbitan")]
        public DateTime? TanggalPenerbitan { get; set; }

        [Column("nama_kepala_madrasah")]
        public string NamaKepalaMadrasah { get; set; } = string.Empty;

        [Column("rata_rata_nilai")]
        public double RataRataNilai { get; set; }

        [Column("dibuat_pada")]
        public DateTime DibuatPada { get; set; } = DateTime.UtcNow;

        [ForeignKey("AlumniId")]
        public Alumni? Alumni { get; set; }

        public ICollection<NilaiUjianIjazah> NilaiUjianIjazahs { get; set; } = new List<NilaiUjianIjazah>();
    }
}
