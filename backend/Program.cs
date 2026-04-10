using AlumniSmartArchive.Backend.Data;
using AlumniSmartArchive.Backend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi(); // or AddSwaggerGen if using Swashbuckle

// 1. Database Configuration (MySQL)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
                       ?? "server=localhost;user=root;password=;database=alumni_archive_db";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// 2. Register Services
builder.Services.AddHttpClient<IAiService, AiService>();

// 3. CORS Policy (Allow Next.js Frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// app.UseHttpsRedirection(); // Disable for local dev if causing SSL issues
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

// Auto-Migrate Database on Startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // db.Database.EnsureDeleted(); // Removed for performance. Enable only if you need to reset schema.
    db.Database.EnsureCreated();
}

app.Run();
