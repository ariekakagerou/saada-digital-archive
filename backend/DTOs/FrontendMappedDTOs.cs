using System;
using System.Collections.Generic;

namespace AlumniSmartArchive.Backend.DTOs
{
    // ========================================
    // 2. DATA ORANG TUA / WALI
    // ========================================
    public class OrangTuaDto
    {
        public int? Id { get; set; }
        public int AlumniId { get; set; }
        public string? NamaAyah { get; set; }
        public string? PekerjaanAyah { get; set; }
        public string? NamaIbu { get; set; }
        public string? PekerjaanIbu { get; set; }
        public string? Alamat { get; set; }
        public string? NomorKontak { get; set; }
    }

    // ========================================
    // 3. DATA AWAL MASUK SEKOLAH
    // ========================================
    public class DataMasukDto
    {
        public int? Id { get; set; }
        public int AlumniId { get; set; }
        public string? AsalSekolah { get; set; }
        public DateTime? TanggalMasuk { get; set; }
        public string? KelasAwal { get; set; }
        public string? TahunAjaranMasuk { get; set; }
        public string? NomorIndukSekolah { get; set; }
    }

    // ========================================
    // 4. RIWAYAT AKADEMIK
    // ========================================
    public class RiwayatAkademikDto
    {
        public int? Id { get; set; }
        public int AlumniId { get; set; }
        public string TingkatKelas { get; set; } = string.Empty; // VII / VIII / IX
        public string TahunAjaran { get; set; } = string.Empty;
        public string Keterangan { get; set; } = string.Empty; // Naik / Tinggal / Pindah
        public string? CatatanPrestasi { get; set; }
    }

    // ========================================
    // 6. DATA MUTASI
    // ========================================
    public class MutasiDto
    {
        public int? Id { get; set; }
        public int AlumniId { get; set; }
        public string JenisMutasi { get; set; } = "Masuk"; // Masuk / Keluar
        public DateTime TanggalMutasi { get; set; }
        public string? SekolahAsalTujuan { get; set; }
        public string? AlasanMutasi { get; set; }
    }

    // ========================================
    // ARSIP DOKUMEN
    // ========================================
    public class ArsipDokumenDto
    {
        public int? Id { get; set; }
        public int AlumniId { get; set; }
        public string JenisDokumen { get; set; } = string.Empty; // Ijazah, SKHU, dll.
        public string NamaFile { get; set; } = string.Empty;
        public string PathFile { get; set; } = string.Empty;
        public string? PathFileProcessed { get; set; }
        public long? UkuranFile { get; set; }
        public string? FormatFile { get; set; }

        public string? OcrText { get; set; }
        public double? OcrConfidence { get; set; }
        public DateTime? OcrProcessedAt { get; set; }

        public string StatusArsip { get; set; } = "Belum Lengkap";
        public string? Keterangan { get; set; }

        public int? UploadedBy { get; set; }
        public DateTime? UploadedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    // ========================================
    // ALUMNI (COMPLETE STANDARDIZED MODEL)
    // ========================================
    public class AlumniMappedDto
    {
        public int? Id { get; set; }

        // IdentitasSiswa
        public string NamaLengkap { get; set; } = string.Empty;
        public string Nis { get; set; } = string.Empty;
        public string? Nisn { get; set; }
        public string? TempatLahir { get; set; }
        public DateTime? TanggalLahir { get; set; }
        public string JenisKelamin { get; set; } = "L";
        public string? Agama { get; set; }
        public string? Kewarganegaraan { get; set; }
        public int? AnakKe { get; set; }
        public int? JumlahSaudara { get; set; }

        // DataKelulusan
        public int TahunLulus { get; set; }
        public string? NomorIjazah { get; set; }
        public string? NomorSkhun { get; set; }
        public DateTime? TanggalKelulusan { get; set; }
        public string StatusKelulusan { get; set; } = "Lulus";
        public double? NilaiAkhir { get; set; }
        public double? RataRata { get; set; }

        // DataAdministratif
        public string? NomorHalamanBukuInduk { get; set; }
        public DateTime? TanggalPencatatan { get; set; }
        public string? NamaKepalaSekolah { get; set; }

        // Relasi (Terkoneksi sempurna dengan struktur Frontend JSON)
        public OrangTuaDto? OrangTua { get; set; }
        public DataMasukDto? DataMasuk { get; set; }
        public List<RiwayatAkademikDto>? RiwayatAkademik { get; set; }
        public List<MutasiDto>? Mutasi { get; set; }
        public List<ArsipDokumenDto>? ArsipDokumen { get; set; }

        // Metadata
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
    }
}
