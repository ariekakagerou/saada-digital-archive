using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AlumniSmartArchive.Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 58, 32, 840, DateTimeKind.Utc).AddTicks(4046));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 58, 32, 842, DateTimeKind.Utc).AddTicks(183));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 58, 32, 842, DateTimeKind.Utc).AddTicks(469));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 58, 32, 842, DateTimeKind.Utc).AddTicks(486));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 5,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 58, 32, 842, DateTimeKind.Utc).AddTicks(496));

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 5, 58, 32, 844, DateTimeKind.Utc).AddTicks(7817), new DateTime(2026, 5, 20, 5, 58, 32, 844, DateTimeKind.Utc).AddTicks(7826) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 2,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 5, 58, 32, 850, DateTimeKind.Utc).AddTicks(7597), new DateTime(2026, 5, 20, 5, 58, 32, 850, DateTimeKind.Utc).AddTicks(7608) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 3,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 5, 58, 32, 850, DateTimeKind.Utc).AddTicks(7668), new DateTime(2026, 5, 20, 5, 58, 32, 850, DateTimeKind.Utc).AddTicks(7669) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 4,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 5, 58, 32, 850, DateTimeKind.Utc).AddTicks(7693), new DateTime(2026, 5, 20, 5, 58, 32, 850, DateTimeKind.Utc).AddTicks(7695) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 5,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 5, 58, 32, 850, DateTimeKind.Utc).AddTicks(7714), new DateTime(2026, 5, 20, 5, 58, 32, 850, DateTimeKind.Utc).AddTicks(7715) });

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 58, 32, 842, DateTimeKind.Utc).AddTicks(5933));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 58, 32, 843, DateTimeKind.Utc).AddTicks(1738));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 58, 32, 843, DateTimeKind.Utc).AddTicks(1751));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 58, 32, 843, DateTimeKind.Utc).AddTicks(1756));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "dibuat_pada", "email", "nama_lengkap", "nama_pengguna" },
                values: new object[] { new DateTime(2026, 5, 20, 5, 58, 32, 833, DateTimeKind.Utc).AddTicks(3712), "ahmadfikri@mts.sch.id", "Ahmad Fikri", "ahmadfikri" });

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 2,
                columns: new[] { "dibuat_pada", "email", "nama_lengkap", "nama_pengguna" },
                values: new object[] { new DateTime(2026, 5, 20, 5, 58, 32, 834, DateTimeKind.Utc).AddTicks(9411), "sitiaminah@mts.sch.id", "Siti Aminah", "sitiaminah" });

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 3,
                columns: new[] { "dibuat_pada", "email", "nama_lengkap", "nama_pengguna" },
                values: new object[] { new DateTime(2026, 5, 20, 5, 58, 32, 834, DateTimeKind.Utc).AddTicks(9434), "budisantoso@mts.sch.id", "Budi Santoso", "budisantoso" });

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 58, 32, 834, DateTimeKind.Utc).AddTicks(9442));

            migrationBuilder.InsertData(
                table: "profil_pengguna",
                columns: new[] { "id", "alamat_lengkap", "angkatan", "avatar_url", "tempat_tanggal_lahir", "kota", "darurat_nama", "darurat_no_hp", "darurat_hubungan", "facebook", "jenis_kelamin", "instagram", "jabatan", "jurusan", "linkedin", "nik", "nisn", "no_hp", "kode_pos", "provinsi", "status_alumni", "tahun_lulus", "tahun_masuk", "unit_lembaga", "diperbarui_pada", "pengguna_id", "website" },
                values: new object[,]
                {
                    { 1, null, null, null, null, null, null, null, null, null, null, null, "Kepala Pengarsipan", null, null, null, null, null, null, null, null, null, null, null, new DateTime(2026, 5, 20, 5, 58, 32, 838, DateTimeKind.Utc).AddTicks(9628), 1, null },
                    { 2, null, null, null, null, null, null, null, null, null, null, null, "Petugas Digitalisasi", null, null, null, null, null, null, null, null, null, null, null, new DateTime(2026, 5, 20, 5, 58, 32, 839, DateTimeKind.Utc).AddTicks(4332), 2, null },
                    { 3, null, null, null, null, null, null, null, null, null, null, null, "Penulis Buku Induk", null, null, null, null, null, null, null, null, null, null, null, new DateTime(2026, 5, 20, 5, 58, 32, 839, DateTimeKind.Utc).AddTicks(4485), 3, null },
                    { 4, null, null, null, null, null, null, null, null, null, null, null, "Super Administrator Utama", null, null, null, null, null, null, null, null, null, null, null, new DateTime(2026, 5, 20, 5, 58, 32, 839, DateTimeKind.Utc).AddTicks(4491), 4, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 4);

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 41, 20, 492, DateTimeKind.Utc).AddTicks(7883));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 41, 20, 494, DateTimeKind.Utc).AddTicks(8154));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 41, 20, 494, DateTimeKind.Utc).AddTicks(8208));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 41, 20, 494, DateTimeKind.Utc).AddTicks(8221));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 5,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 41, 20, 494, DateTimeKind.Utc).AddTicks(8231));

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 5, 41, 20, 497, DateTimeKind.Utc).AddTicks(3343), new DateTime(2026, 5, 20, 5, 41, 20, 497, DateTimeKind.Utc).AddTicks(3348) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 2,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 5, 41, 20, 506, DateTimeKind.Utc).AddTicks(6887), new DateTime(2026, 5, 20, 5, 41, 20, 506, DateTimeKind.Utc).AddTicks(6895) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 3,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 5, 41, 20, 506, DateTimeKind.Utc).AddTicks(6969), new DateTime(2026, 5, 20, 5, 41, 20, 506, DateTimeKind.Utc).AddTicks(6971) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 4,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 5, 41, 20, 506, DateTimeKind.Utc).AddTicks(6995), new DateTime(2026, 5, 20, 5, 41, 20, 506, DateTimeKind.Utc).AddTicks(6996) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 5,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 5, 41, 20, 506, DateTimeKind.Utc).AddTicks(7216), new DateTime(2026, 5, 20, 5, 41, 20, 506, DateTimeKind.Utc).AddTicks(7218) });

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 41, 20, 495, DateTimeKind.Utc).AddTicks(4150));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 41, 20, 495, DateTimeKind.Utc).AddTicks(9781));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 41, 20, 495, DateTimeKind.Utc).AddTicks(9794));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 41, 20, 495, DateTimeKind.Utc).AddTicks(9798));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "dibuat_pada", "email", "nama_lengkap", "nama_pengguna" },
                values: new object[] { new DateTime(2026, 5, 20, 5, 41, 20, 486, DateTimeKind.Utc).AddTicks(2562), "admin@mts.sch.id", "Kepala Pengarsipan", "admin" });

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 2,
                columns: new[] { "dibuat_pada", "email", "nama_lengkap", "nama_pengguna" },
                values: new object[] { new DateTime(2026, 5, 20, 5, 41, 20, 488, DateTimeKind.Utc).AddTicks(634), "operator@mts.sch.id", "Petugas Digitalisasi", "operator" });

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 3,
                columns: new[] { "dibuat_pada", "email", "nama_lengkap", "nama_pengguna" },
                values: new object[] { new DateTime(2026, 5, 20, 5, 41, 20, 488, DateTimeKind.Utc).AddTicks(669), "penulis@mts.sch.id", "Penulis Buku Induk", "penulis" });

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 41, 20, 488, DateTimeKind.Utc).AddTicks(675));
        }
    }
}
