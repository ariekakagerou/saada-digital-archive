using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AlumniSmartArchive.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAlumniIdToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "alumni_id",
                table: "pengguna",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 1,
                column: "alumni_id",
                value: null);

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 2,
                column: "alumni_id",
                value: null);

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 3,
                column: "alumni_id",
                value: null);

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 4,
                column: "alumni_id",
                value: null);

            migrationBuilder.InsertData(
                table: "pengguna",
                columns: new[] { "id", "aktif", "alumni_id", "dibuat_pada", "email", "nama_lengkap", "nip", "kata_sandi", "peran", "nama_pengguna" },
                values: new object[] { 5, true, 1, new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc), "alumni@mts.sch.id", "Ahmad Faisal Ramadhan", "0021001234", "alumni123", "Alumni", "alumnidemo" });

            migrationBuilder.InsertData(
                table: "profil_pengguna",
                columns: new[] { "id", "alamat_lengkap", "angkatan", "avatar_url", "tempat_tanggal_lahir", "kota", "darurat_nama", "darurat_no_hp", "darurat_hubungan", "facebook", "jenis_kelamin", "instagram", "jabatan", "jurusan", "linkedin", "nik", "nisn", "no_hp", "kode_pos", "provinsi", "status_alumni", "tahun_lulus", "tahun_masuk", "unit_lembaga", "diperbarui_pada", "pengguna_id", "website" },
                values: new object[] { 5, null, null, null, null, null, null, null, null, null, null, null, "Alumni", null, null, null, "0021001234", null, null, null, "Aktif", "2024", null, null, new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc), 5, null });

            migrationBuilder.CreateIndex(
                name: "IX_pengguna_alumni_id",
                table: "pengguna",
                column: "alumni_id");

            migrationBuilder.AddForeignKey(
                name: "FK_pengguna_alumni_alumni_id",
                table: "pengguna",
                column: "alumni_id",
                principalTable: "alumni",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_pengguna_alumni_alumni_id",
                table: "pengguna");

            migrationBuilder.DropIndex(
                name: "IX_pengguna_alumni_id",
                table: "pengguna");

            migrationBuilder.DeleteData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 5);

            migrationBuilder.DropColumn(
                name: "alumni_id",
                table: "pengguna");
        }
    }
}
