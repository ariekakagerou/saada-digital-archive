using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlumniSmartArchive.Backend.Models
{
    [Table("tracer_study")]
    public class TracerStudy
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("alumni_id")]
        public int AlumniId { get; set; }

        [Column("status_saat_ini")]
        public string StatusSaatIni { get; set; } = string.Empty; // Bekerja, Kuliah, Wirausaha, Mencari Kerja

        [Column("nama_instansi")]
        public string NamaInstansi { get; set; } = string.Empty;

        [Column("jabatan_atau_jurusan")]
        public string JabatanAtauJurusan { get; set; } = string.Empty;

        [Column("alamat_instansi")]
        public string AlamatInstansi { get; set; } = string.Empty;

        [Column("tahun_mulai")]
        public string TahunMulai { get; set; } = string.Empty;

        [Column("catatan_tambahan")]
        public string CatatanTambahan { get; set; } = string.Empty;

        [Column("diperbarui_pada")]
        public DateTime DiperbaruiPada { get; set; } = DateTime.UtcNow;

        [ForeignKey("AlumniId")]
        public Alumni? Alumni { get; set; }
    }
}
