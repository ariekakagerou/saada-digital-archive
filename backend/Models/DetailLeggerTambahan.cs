using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlumniSmartArchive.Backend.Models
{
    [Table("detail_legger_tambahan")]
    public class DetailLeggerTambahan
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("nilai_semester_id")]
        public int NilaiSemesterId { get; set; }

        [Column("kehadiran_sakit")]
        public int KehadiranSakit { get; set; } = 0;

        [Column("kehadiran_izin")]
        public int KehadiranIzin { get; set; } = 0;

        [Column("kehadiran_alfa")]
        public int KehadiranAlfa { get; set; } = 0;

        [Column("sikap_spiritual")]
        public string SikapSpiritual { get; set; } = "Baik";

        [Column("sikap_sosial")]
        public string SikapSosial { get; set; } = "Baik";

        [Column("catatan_wali_kelas")]
        public string CatatanWaliKelas { get; set; } = string.Empty;

        [Column("dibuat_pada")]
        public DateTime DibuatPada { get; set; } = DateTime.UtcNow;

        [ForeignKey("NilaiSemesterId")]
        public NilaiSemester? NilaiSemester { get; set; }
    }
}
