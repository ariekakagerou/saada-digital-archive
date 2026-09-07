using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AlumniSmartArchive.Backend.Data;
using AlumniSmartArchive.Backend.Models;
using AlumniSmartArchive.Backend.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace AlumniSmartArchive.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProfileController(AppDbContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }
            // Fallback for development if no token
            return 4; // Super Administrator
        }

        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetCurrentUserId();

            var user = await _context.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound(new { message = "User tidak ditemukan" });

            var response = new
            {
                user.FullName,
                user.Email,
                user.Username,
                JoinedDate = user.DibuatPada.ToString("d MMMM yyyy HH:mm"),
                Role = user.Role,
                Profile = user.Profile != null ? new ProfileDto
                {
                    Phone = user.Profile.Phone,
                    Nik = user.Profile.Nik,
                    Gender = user.Profile.Gender,
                    BirthPlaceDate = user.Profile.BirthPlaceDate,
                    Address = user.Profile.Address,
                    City = user.Profile.City,
                    Province = user.Profile.Province,
                    PostalCode = user.Profile.PostalCode,

                    Nisn = user.Profile.Nisn,
                    TahunMasuk = user.Profile.TahunMasuk,
                    TahunLulus = user.Profile.TahunLulus,
                    Jurusan = user.Profile.Jurusan,
                    Angkatan = user.Profile.Angkatan,
                    StatusAlumni = user.Profile.StatusAlumni,
                    UnitLembaga = user.Profile.UnitLembaga,
                    Jabatan = user.Profile.Jabatan,

                    EmergencyName = user.Profile.EmergencyName,
                    EmergencyRelation = user.Profile.EmergencyRelation,
                    EmergencyPhone = user.Profile.EmergencyPhone,

                    Facebook = user.Profile.Facebook,
                    Instagram = user.Profile.Instagram,
                    LinkedIn = user.Profile.LinkedIn,
                    Website = user.Profile.Website,
                    AvatarUrl = user.Profile.AvatarUrl
                } : new ProfileDto()
            };

            return Ok(response);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileUpdateDto model)
        {
            var userId = GetCurrentUserId();

            var user = await _context.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound(new { message = "User tidak ditemukan" });

            // Update core user data
            user.FullName = model.FullName;
            user.Email = model.Email;
            user.Username = model.Username;

            // Update or create profile
            if (user.Profile == null)
            {
                user.Profile = new UserProfile { UserId = userId };
                _context.UserProfiles.Add(user.Profile);
            }

            user.Profile.Phone = model.Profile.Phone;
            user.Profile.Nik = model.Profile.Nik;
            user.Profile.Gender = model.Profile.Gender;
            user.Profile.BirthPlaceDate = model.Profile.BirthPlaceDate;
            user.Profile.Address = model.Profile.Address;
            user.Profile.City = model.Profile.City;
            user.Profile.Province = model.Profile.Province;
            user.Profile.PostalCode = model.Profile.PostalCode;

            user.Profile.Nisn = model.Profile.Nisn;
            user.Profile.TahunMasuk = model.Profile.TahunMasuk;
            user.Profile.TahunLulus = model.Profile.TahunLulus;
            user.Profile.Jurusan = model.Profile.Jurusan;
            user.Profile.Angkatan = model.Profile.Angkatan;
            user.Profile.StatusAlumni = model.Profile.StatusAlumni;
            user.Profile.UnitLembaga = model.Profile.UnitLembaga;
            user.Profile.Jabatan = model.Profile.Jabatan;

            user.Profile.EmergencyName = model.Profile.EmergencyName;
            user.Profile.EmergencyRelation = model.Profile.EmergencyRelation;
            user.Profile.EmergencyPhone = model.Profile.EmergencyPhone;

            user.Profile.Facebook = model.Profile.Facebook;
            user.Profile.Instagram = model.Profile.Instagram;
            user.Profile.LinkedIn = model.Profile.LinkedIn;
            user.Profile.Website = model.Profile.Website;
            
            if (!string.IsNullOrEmpty(model.Profile.AvatarUrl))
            {
                user.Profile.AvatarUrl = model.Profile.AvatarUrl;
            }
            
            user.Profile.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Profil berhasil diperbarui" });
        }
    }
}
