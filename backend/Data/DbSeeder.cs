using AlumniSmartArchive.Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AlumniSmartArchive.Backend.Data
{
    public static class DbSeeder
    {
        public static async Task Seed30DataPerArsipAsync(AppDbContext context)
        {
            // 0. Pastikan Akun Demo Alumni (alumnidemo) Ada
            var demoUser = await context.Users.FirstOrDefaultAsync(u => u.Username == "alumnidemo" || u.Email == "alumni@mts.sch.id");
            if (demoUser == null)
            {
                var newAlumniUser = new User
                {
                    Username = "alumnidemo",
                    FullName = "Ahmad Faisal Ramadhan",
                    Email = "alumni@mts.sch.id",
                    Nip = "0021001234",
                    PasswordHash = "alumni123",
                    Role = "Alumni",
                    AlumniId = 1,
                    Active = true,
                    DibuatPada = DateTime.UtcNow
                };
                context.Users.Add(newAlumniUser);
                await context.SaveChangesAsync();

                var profile = new UserProfile
                {
                    UserId = newAlumniUser.Id,
                    Nisn = "0021001234",
                    Jabatan = "Alumni",
                    TahunLulus = "2024",
                    StatusAlumni = "Aktif",
                    UpdatedAt = DateTime.UtcNow
                };
                context.UserProfiles.Add(profile);
                await context.SaveChangesAsync();
            }

            // 1. Pastikan Data Alumni Ada Minimal 30
            var alumniList = await context.Alumni.OrderBy(a => a.Id).Take(30).ToListAsync();
            if (alumniList.Count < 30)
            {
                int countNeeded = 30 - alumniList.Count;
                int startId = alumniList.Count + 1;
                for (int i = 0; i < countNeeded; i++)
                {
                    int currentNum = startId + i;
                    var newAlumni = new Alumni
                    {
                        FullName = $"Alumni Contoh {currentNum}",
                        Nisn = $"009500{currentNum:D4}",
                        Nis = $"210{currentNum:D3}",
                        JenisKelamin = currentNum % 2 == 0 ? "P" : "L",
                        TempatLahir = "Bogor",
                        GraduationYear = 2024,
                        BirthDate = new DateTime(2006, 1 + (currentNum % 12), 1 + (currentNum % 28)),
                        Address = $"Jl. Raya Assa'adah No. {currentNum}, Bogor",
                        DibuatPada = DateTime.UtcNow
                    };
                    context.Alumni.Add(newAlumni);
                }
                await context.SaveChangesAsync();
                alumniList = await context.Alumni.OrderBy(a => a.Id).Take(30).ToListAsync();
            }

            // Kategori Arsip yang akan di-seed masing-masing 30
            string[] categories = new[] { "Ijazah", "SKL", "Rapor", "Buku Induk", "Transkrip" };

            foreach (var category in categories)
            {
                int existingCount = await context.Archives.CountAsync(a => a.JenisArsip == category);

                if (existingCount < 30)
                {
                    int needed = 30 - existingCount;

                    for (int i = 0; i < needed; i++)
                    {
                        var alumni = alumniList[i % alumniList.Count];
                        int docNum = existingCount + i + 1;
                        string ext = category == "Buku Induk" ? "png" : (category == "Ijazah" ? "jpg" : "pdf");
                        string fileType = category == "Buku Induk" ? "PNG" : (category == "Ijazah" ? "JPG" : "PDF");

                        var archive = new Archive
                        {
                            AlumniId = alumni.Id,
                            FilePath = $"{category.ToLower().Replace(" ", "_")}_alumni_{alumni.Id}_{docNum}.{ext}",
                            FileType = fileType,
                            JenisArsip = category,
                            StatusArsip = docNum % 7 == 0 ? "Belum Lengkap" : "Lengkap",
                            UkuranFile = 250000 + (docNum * 1500),
                            Pengunggah = "Sistem Auto-Seed",
                            UploadedAt = DateTime.UtcNow.AddDays(-docNum)
                        };

                        archive.OcrResult = new OcrResult
                        {
                            ExtractedText = $"NOMOR DOKUMEN: {category.ToUpper()}/2024/{docNum:D3}\nNAMA SISWA: {alumni.FullName}\nNISN: {alumni.Nisn}\nNIS: {alumni.Nis}\nSTATUS: TERVERIFIKASI LULUS\nTANGGAL TERBIT: 15 Juni 2024",
                            ConfidenceScore = Math.Min(99.5, 85.0 + (docNum % 15)),
                            Status = "Selesai"
                        };

                        context.Archives.Add(archive);
                    }
                    await context.SaveChangesAsync();
                }
            }

            // 2. Data Tabel Buku Induk (Minimal 30 record)
            int existingBukuInduk = await context.BukuInduks.CountAsync();
            if (existingBukuInduk < 30)
            {
                var existingBukuIndukAlumniIds = await context.BukuInduks.Select(b => b.AlumniId).ToListAsync();
                foreach (var alumni in alumniList)
                {
                    if (!existingBukuIndukAlumniIds.Contains(alumni.Id))
                    {
                        var bi = new BukuInduk
                        {
                            AlumniId = alumni.Id,
                            Nis = alumni.Nis,
                            Nisn = alumni.Nisn,
                            NamaLengkap = alumni.FullName,
                            JenisKelamin = alumni.JenisKelamin,
                            TempatLahir = string.IsNullOrEmpty(alumni.TempatLahir) ? "Bogor" : alumni.TempatLahir,
                            TanggalLahir = alumni.BirthDate?.ToString("dd MMMM yyyy") ?? "10 Mei 2006",
                            Agama = "Islam",
                            Kewarganegaraan = "WNI",
                            NamaAyah = $"Ayah {alumni.FullName}",
                            NamaIbu = $"Ibu {alumni.FullName}",
                            PekerjaanAyah = "Wiraswasta",
                            PekerjaanIbu = "Ibu Rumah Tangga",
                            PendidikanAyah = "SMA",
                            PendidikanIbu = "SMA",
                            AlamatOrangTua = string.IsNullOrEmpty(alumni.Address) ? "Bogor" : alumni.Address,
                            NoHpWali = $"0812{alumni.Id:D4}5678",
                            TahunMasuk = "2021",
                            AsalSekolah = "SDN 1 Bogor",
                            KelasMasuk = "VII-A",
                            Jurusan = "-",
                            RataRata = 85.0 + (alumni.Id % 10),
                            PrestasiAkademik = alumni.Id % 3 == 0 ? "Juara Kelas" : "-",
                            CatatanKegiatan = "Aktif dalam kegiatan ekstrakurikuler sekolah",
                            TahunLulus = alumni.GraduationYear.ToString(),
                            NomorIjazah = $"DN-05-7/MTs/{alumni.Id:D3}/2024",
                            NomorSkhun = $"SKHUN/MTs/{alumni.Id:D3}/2024",
                            StatusSiswa = "Lulus",
                            EmailAlumni = $"alumni{alumni.Id}@gmail.com",
                            NomorHpAlumni = $"0857{alumni.Id:D4}8901",
                            PekerjaanSekarang = alumni.Id % 2 == 0 ? "Melanjutkan Sekolah" : "Bekerja",
                            PerguruanTinggi = alumni.Id % 2 == 0 ? "SMA Negeri 1 Bogor" : "-",
                            AlamatSekarang = string.IsNullOrEmpty(alumni.Address) ? "Bogor" : alumni.Address,
                            StatusArsip = "Lengkap",
                            DibuatPada = DateTime.UtcNow,
                            DiperbaruiPada = DateTime.UtcNow
                        };
                        context.BukuInduks.Add(bi);
                    }
                }
                await context.SaveChangesAsync();
            }

            // 3. Data Tabel Detail Ijazah (Minimal 30 record)
            int existingIjazah = await context.DetailIjazahs.CountAsync();
            if (existingIjazah < 30)
            {
                var existingIjazahAlumniIds = await context.DetailIjazahs.Select(d => d.AlumniId).ToListAsync();
                foreach (var alumni in alumniList)
                {
                    if (!existingIjazahAlumniIds.Contains(alumni.Id))
                    {
                        var ij = new DetailIjazah
                        {
                            AlumniId = alumni.Id,
                            TanggalPenerbitan = new DateTime(2024, 6, 15, 0, 0, 0, DateTimeKind.Utc),
                            NamaKepalaMadrasah = "Drs. H. Ahmad Fauzi, M.Pd.I",
                            RataRataNilai = 84.0 + (alumni.Id % 11),
                            DibuatPada = DateTime.UtcNow
                        };
                        context.DetailIjazahs.Add(ij);
                    }
                }
                await context.SaveChangesAsync();
            }

            // 4. Data Tabel Detail SKL (Minimal 30 record)
            int existingSkl = await context.DetailSkls.CountAsync();
            if (existingSkl < 30)
            {
                var existingSklAlumniIds = await context.DetailSkls.Select(d => d.AlumniId).ToListAsync();
                foreach (var alumni in alumniList)
                {
                    if (!existingSklAlumniIds.Contains(alumni.Id))
                    {
                        var skl = new DetailSkl
                        {
                            AlumniId = alumni.Id,
                            NomorPeserta = $"02-005-{alumni.Id:D3}-8",
                            TanggalTerbit = new DateTime(2024, 6, 10, 0, 0, 0, DateTimeKind.Utc),
                            RataRataNilai = 83.5 + (alumni.Id % 12),
                            DibuatPada = DateTime.UtcNow
                        };
                        context.DetailSkls.Add(skl);
                    }
                }
                await context.SaveChangesAsync();
            }
        }
    }
}
