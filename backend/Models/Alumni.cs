using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AlumniSmartArchive.Backend.Models
{
    [Table("alumni")]
    public class Alumni
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("nisn")]
        public string Nisn { get; set; } = string.Empty;

        [Column("nis")]
        public string Nis { get; set; } = string.Empty;

        [Column("nama_lengkap")]
        public string FullName { get; set; } = string.Empty;

        [Column("jenis_kelamin")]
        public string JenisKelamin { get; set; } = "L";

        [Column("tempat_lahir")]
        public string TempatLahir { get; set; } = string.Empty;

        [Column("tahun_lulus")]
        public int GraduationYear { get; set; }

        [Column("tanggal_lahir")]
        public DateTime? BirthDate { get; set; }

        [Column("alamat")]
        public string Address { get; set; } = string.Empty;

        [Column("dibuat_pada")]
        public DateTime DibuatPada { get; set; } = DateTime.UtcNow;

        // Navigation
        [JsonIgnore]
        public ICollection<BukuInduk> BukuInduks { get; set; } = new List<BukuInduk>();
        
        [JsonIgnore]
        public ICollection<Mutasi> Mutasis { get; set; } = new List<Mutasi>();
        
        [JsonIgnore]
        public ICollection<TracerStudy> TracerStudies { get; set; } = new List<TracerStudy>();
        
        [JsonIgnore]
        public ICollection<PermohonanDokumen> PermohonanDokumens { get; set; } = new List<PermohonanDokumen>();
        
        [JsonIgnore]
        public ICollection<DetailIjazah> DetailIjazahs { get; set; } = new List<DetailIjazah>();
        
        [JsonIgnore]
        public ICollection<DetailSkl> DetailSkls { get; set; } = new List<DetailSkl>();
    }
}
