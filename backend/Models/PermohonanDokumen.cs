using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlumniSmartArchive.Backend.Models
{
    [Table("permohonan_dokumen")]
    public class PermohonanDokumen
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("alumni_id")]
        public int AlumniId { get; set; }

        [Column("jenis_dokumen")]
        public string JenisDokumen { get; set; } = string.Empty; // Ijazah, SKHUN, Transkrip

        [Column("tujuan_permohonan")]
        public string TujuanPermohonan { get; set; } = string.Empty; // Melamar Kerja, Lanjut Studi

        [Column("jumlah_copy")]
        public int JumlahCopy { get; set; } = 1;

        [Column("status_permohonan")]
        public string StatusPermohonan { get; set; } = "Menunggu"; // Menunggu, Diproses, Selesai, Ditolak

        [Column("keterangan")]
        public string Keterangan { get; set; } = string.Empty;

        [Column("tanggal_pengajuan")]
        public DateTime TanggalPengajuan { get; set; } = DateTime.UtcNow;

        [Column("tanggal_selesai")]
        public DateTime? TanggalSelesai { get; set; }

        [ForeignKey("AlumniId")]
        public Alumni? Alumni { get; set; }
    }
}
