using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AlumniSmartArchive.Backend.Data;
using AlumniSmartArchive.Backend.Models;

namespace AlumniSmartArchive.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TracerStudyController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TracerStudyController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.TracerStudies.Include(t => t.Alumni).OrderByDescending(t => t.DiperbaruiPada).ToListAsync();
            return Ok(new { success = true, data });
        }

        [HttpGet("alumni/{alumniId}")]
        public async Task<IActionResult> GetByAlumniId(int alumniId)
        {
            var data = await _context.TracerStudies.Where(t => t.AlumniId == alumniId).OrderByDescending(t => t.DiperbaruiPada).ToListAsync();
            return Ok(new { success = true, data });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TracerStudy tracerStudy)
        {
            tracerStudy.DiperbaruiPada = DateTime.UtcNow;
            _context.TracerStudies.Add(tracerStudy);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, data = tracerStudy });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TracerStudy tracerStudy)
        {
            if (id != tracerStudy.Id) return BadRequest(new { success = false, message = "ID tidak cocok" });

            tracerStudy.DiperbaruiPada = DateTime.UtcNow;
            _context.Entry(tracerStudy).State = EntityState.Modified;
            
            try 
            { 
                await _context.SaveChangesAsync(); 
            }
            catch (DbUpdateConcurrencyException) 
            {
                if (!await _context.TracerStudies.AnyAsync(e => e.Id == id)) 
                    return NotFound(new { success = false, message = "Data tidak ditemukan" });
                else throw;
            }

            return Ok(new { success = true, data = tracerStudy });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var tracer = await _context.TracerStudies.FindAsync(id);
            if (tracer == null) return NotFound(new { success = false, message = "Data tidak ditemukan" });

            _context.TracerStudies.Remove(tracer);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Berhasil dihapus" });
        }
    }
}
