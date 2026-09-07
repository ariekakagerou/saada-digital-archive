using AlumniSmartArchive.Backend.Data;
using AlumniSmartArchive.Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlumniSmartArchive.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Hanya user yang sudah login yang bisa akses
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        [Authorize(Roles = "AdminSuper,Admin")]
        public async Task<IActionResult> GetAll()
        {
            var users = await _context.Users
                .OrderByDescending(u => u.DibuatPada)
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Email,
                    u.Nip,
                    u.Role,
                    u.Active,
                    u.DibuatPada
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/users/5
        [HttpGet("{id}")]
        [Authorize(Roles = "AdminSuper,Admin")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User tidak ditemukan" });

            return Ok(new {
                user.Id,
                user.Username,
                user.FullName,
                user.Email,
                user.Nip,
                user.Role,
                user.Active,
                user.DibuatPada
            });
        }

        // PUT: api/users/5
        [HttpPut("{id}")]
        [Authorize(Roles = "AdminSuper")]
        public async Task<IActionResult> Update(int id, [FromBody] UserUpdateRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User tidak ditemukan" });

            user.FullName = request.FullName;
            user.Role = request.Role;
            user.Active = request.Active;
            user.Nip = request.Nip ?? string.Empty;

            if (!string.IsNullOrEmpty(request.Email))
                user.Email = request.Email;

            await _context.SaveChangesAsync();
            return Ok(new { message = "User berhasil diperbarui" });
        }

        // DELETE: api/users/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "AdminSuper")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User tidak ditemukan" });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "User berhasil dihapus" });
        }
    }

    public class UserUpdateRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = "Operator";
        public bool Active { get; set; } = true;
        public string? Nip { get; set; }
    }
}
