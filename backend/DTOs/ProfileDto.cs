using System.ComponentModel.DataAnnotations;

namespace AlumniSmartArchive.Backend.DTOs
{
    public class ProfileDto
    {
        // Data Pribadi
        public string? Phone { get; set; }
        public string? Nik { get; set; }
        public string? Gender { get; set; }
        public string? BirthPlaceDate { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Province { get; set; }
        public string? PostalCode { get; set; }

        // Informasi Akademik
        public string? Nisn { get; set; }
        public string? TahunMasuk { get; set; }
        public string? TahunLulus { get; set; }
        public string? Jurusan { get; set; }
        public string? Angkatan { get; set; }
        public string? StatusAlumni { get; set; }
        public string? UnitLembaga { get; set; }
        public string? Jabatan { get; set; }

        // Kontak Darurat
        public string? EmergencyName { get; set; }
        public string? EmergencyRelation { get; set; }
        public string? EmergencyPhone { get; set; }

        // Media Sosial
        public string? Facebook { get; set; }
        public string? Instagram { get; set; }
        public string? LinkedIn { get; set; }
        public string? Website { get; set; }

        public string? AvatarUrl { get; set; }
    }

    public class ProfileUpdateDto
    {
        // Core User Data
        [Required]
        public string FullName { get; set; } = string.Empty;
        
        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Username { get; set; } = string.Empty;

        public ProfileDto Profile { get; set; } = new ProfileDto();
    }
}
