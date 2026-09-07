using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlumniSmartArchive.Backend.Models
{
    [Table("nilai_ujian_ijazah")]
    public class NilaiUjianIjazah
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("detail_ijazah_id")]
        public int DetailIjazahId { get; set; }

        [Column("mata_pelajaran_id")]
        public int MataPelajaranId { get; set; }

        [Column("nilai")]
        public double Nilai { get; set; }

        [ForeignKey("DetailIjazahId")]
        public DetailIjazah? DetailIjazah { get; set; }

        [ForeignKey("MataPelajaranId")]
        public MataPelajaran? MataPelajaran { get; set; }
    }
}
