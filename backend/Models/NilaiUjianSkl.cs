using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlumniSmartArchive.Backend.Models
{
    [Table("nilai_ujian_skl")]
    public class NilaiUjianSkl
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("detail_skl_id")]
        public int DetailSklId { get; set; }

        [Column("mata_pelajaran_id")]
        public int MataPelajaranId { get; set; }

        [Column("nilai")]
        public double Nilai { get; set; }

        [ForeignKey("DetailSklId")]
        public DetailSkl? DetailSkl { get; set; }

        [ForeignKey("MataPelajaranId")]
        public MataPelajaran? MataPelajaran { get; set; }
    }
}
