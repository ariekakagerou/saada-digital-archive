using AlumniSmartArchive.Backend.Data;
using AlumniSmartArchive.Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

// 1. Database Configuration (MySQL)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                       ?? "server=localhost;user=root;password=;database=alumni_archive_db";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// 2. Register Services
builder.Services.AddHttpClient<IAiService, AiService>(client =>
{
    // EasyOCR pada CPU bisa butuh ~2-3 menit saat inisialisasi model pertama kali
    client.Timeout = TimeSpan.FromMinutes(5);
});

// 3. JWT Authentication
var jwtKey    = builder.Configuration["Jwt:Key"]      ?? "SAADA_SuperSecretKey_2026_AlumniArchive_MTs_Assaadah!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"]   ?? "saada-backend";
var jwtAud    = builder.Configuration["Jwt:Audience"] ?? "saada-frontend";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = jwtIssuer,
            ValidAudience            = jwtAud,
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// 4. CORS Policy (Allow Next.js Frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.AllowAnyOrigin()
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

app.UseCors("AllowFrontend");
app.UseAuthentication(); // WAJIB sebelum UseAuthorization
app.UseAuthorization();
app.MapControllers();

// Auto-Migrate Database on Startup & Seed 30 Arsip Data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    await DbSeeder.Seed30DataPerArsipAsync(db);
}

app.Run();
