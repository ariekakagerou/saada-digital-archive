namespace AlumniSmartArchive.Backend.DTOs
{
    // ── Auth DTOs ──
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Nama { get; set; } = string.Empty;
        public string Nip { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    // ── Upload DTOs ──
    public class UploadRequest
    {
        public IFormFile File { get; set; } = null!;
        public string? Description { get; set; }
        public string JenisArsip { get; set; } = "Ijazah";
    }

    public class OcrProcessRequest
    {
        public int ArchiveId { get; set; }
    }

    // ── Buku Induk DTOs ──
    public class NilaiMapelDto
    {
        public string Nama { get; set; } = string.Empty;
        public int Nilai { get; set; }
    }

    public class NilaiSemesterDto
    {
        public string Semester { get; set; } = string.Empty;
        public List<NilaiMapelDto> MataPelajaran { get; set; } = new();
        public double Rata { get; set; }
    }

    public class EkskulDto
    {
        public string Nama { get; set; } = string.Empty;
        public string Jabatan { get; set; } = string.Empty;
        public string Tahun { get; set; } = string.Empty;
    }

    public class PrestasiDto
    {
        public string Nama { get; set; } = string.Empty;
        public string Tingkat { get; set; } = string.Empty;
        public string Tahun { get; set; } = string.Empty;
        public string Juara { get; set; } = string.Empty;
    }

    public class BukuIndukResponse
    {
        public int Id { get; set; }
        // Identitas
        public string Nis { get; set; } = string.Empty;
        public string Nisn { get; set; } = string.Empty;
        public string NamaLengkap { get; set; } = string.Empty;
        public string JenisKelamin { get; set; } = "L";
        public string TempatLahir { get; set; } = string.Empty;
        public string TanggalLahir { get; set; } = string.Empty;
        public string Agama { get; set; } = string.Empty;
        public string Kewarganegaraan { get; set; } = string.Empty;
        // Keluarga
        public string NamaAyah { get; set; } = string.Empty;
        public string NamaIbu { get; set; } = string.Empty;
        public string PekerjaanAyah { get; set; } = string.Empty;
        public string PekerjaanIbu { get; set; } = string.Empty;
        public string PendidikanAyah { get; set; } = string.Empty;
        public string PendidikanIbu { get; set; } = string.Empty;
        public string AlamatOrangTua { get; set; } = string.Empty;
        public string NoHpWali { get; set; } = string.Empty;
        // Sekolah
        public string TahunMasuk { get; set; } = string.Empty;
        public string AsalSekolah { get; set; } = string.Empty;
        public string KelasMasuk { get; set; } = string.Empty;
        public string Jurusan { get; set; } = string.Empty;
        // Akademik
        public List<NilaiSemesterDto> NilaiSemester { get; set; } = new();
        public double RataRata { get; set; }
        public string PrestasiAkademik { get; set; } = string.Empty;
        // Non Akademik
        public List<EkskulDto> Ekskul { get; set; } = new();
        public List<PrestasiDto> PrestasiLomba { get; set; } = new();
        public string CatatanKegiatan { get; set; } = string.Empty;
        // Kelulusan
        public string TahunLulus { get; set; } = string.Empty;
        public string NomorIjazah { get; set; } = string.Empty;
        public string NomorSkhun { get; set; } = string.Empty;
        public string StatusKelulusan { get; set; } = string.Empty;
        // Alumni
        public string EmailAlumni { get; set; } = string.Empty;
        public string NomorHpAlumni { get; set; } = string.Empty;
        public string PekerjaanSekarang { get; set; } = string.Empty;
        public string PerguruanTinggi { get; set; } = string.Empty;
        public string AlamatSekarang { get; set; } = string.Empty;
        // Meta
        public string StatusArsip { get; set; } = string.Empty;
        public string? Foto { get; set; }
    }

    public class CreateBukuIndukRequest
    {
        // Identitas
        public string Nis { get; set; } = string.Empty;
        public string Nisn { get; set; } = string.Empty;
        public string NamaLengkap { get; set; } = string.Empty;
        public string JenisKelamin { get; set; } = "L";
        public string TempatLahir { get; set; } = string.Empty;
        public string TanggalLahir { get; set; } = string.Empty;
        public string Agama { get; set; } = "Islam";
        public string Kewarganegaraan { get; set; } = "WNI";
        // Keluarga
        public string NamaAyah { get; set; } = string.Empty;
        public string NamaIbu { get; set; } = string.Empty;
        public string PekerjaanAyah { get; set; } = string.Empty;
        public string PekerjaanIbu { get; set; } = string.Empty;
        public string PendidikanAyah { get; set; } = string.Empty;
        public string PendidikanIbu { get; set; } = string.Empty;
        public string AlamatOrangTua { get; set; } = string.Empty;
        public string NoHpWali { get; set; } = string.Empty;
        // Sekolah
        public string TahunMasuk { get; set; } = string.Empty;
        public string AsalSekolah { get; set; } = string.Empty;
        public string KelasMasuk { get; set; } = string.Empty;
        public string Jurusan { get; set; } = "-";
        // Akademik
        public List<NilaiSemesterDto>? NilaiSemester { get; set; }
        public double RataRata { get; set; }
        public string PrestasiAkademik { get; set; } = string.Empty;
        // Non Akademik
        public List<EkskulDto>? Ekskul { get; set; }
        public List<PrestasiDto>? PrestasiLomba { get; set; }
        public string CatatanKegiatan { get; set; } = string.Empty;
        // Kelulusan
        public string TahunLulus { get; set; } = string.Empty;
        public string NomorIjazah { get; set; } = string.Empty;
        public string NomorSkhun { get; set; } = string.Empty;
        public string StatusKelulusan { get; set; } = "Lulus";
        // Alumni
        public string EmailAlumni { get; set; } = string.Empty;
        public string NomorHpAlumni { get; set; } = string.Empty;
        public string PekerjaanSekarang { get; set; } = string.Empty;
        public string PerguruanTinggi { get; set; } = string.Empty;
        public string AlamatSekarang { get; set; } = string.Empty;
        // Meta
        public string StatusArsip { get; set; } = "Belum Lengkap";
    }
}
