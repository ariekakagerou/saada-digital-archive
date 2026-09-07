using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AlumniSmartArchive.Backend.Migrations
{
    /// <inheritdoc />
    public partial class SeedDetailData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "detail_ijazah",
                columns: new[] { "id", "alumni_id", "dibuat_pada", "nama_kepala_madrasah", "rata_rata_nilai", "tanggal_penerbitan" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Drs. H. Ahmad Fauzi, M.Pd.I", 86.25, new DateTime(2024, 6, 15, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, 2, new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Drs. H. Ahmad Fauzi, M.Pd.I", 84.75, new DateTime(2023, 6, 15, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "detail_skl",
                columns: new[] { "id", "alumni_id", "dibuat_pada", "nomor_peserta", "rata_rata_nilai", "tanggal_terbit" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc), "03-001-024-9", 87.5, new DateTime(2024, 6, 10, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, 2, new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc), "03-001-025-8", 85.0, new DateTime(2023, 6, 10, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "nilai_ujian_ijazah",
                columns: new[] { "id", "detail_ijazah_id", "mata_pelajaran_id", "nilai" },
                values: new object[,]
                {
                    { 1, 1, 1, 88.0 },
                    { 2, 1, 6, 87.0 },
                    { 3, 1, 8, 84.0 },
                    { 4, 1, 9, 86.0 },
                    { 5, 2, 1, 85.0 },
                    { 6, 2, 6, 86.0 },
                    { 7, 2, 8, 80.0 },
                    { 8, 2, 9, 88.0 }
                });

            migrationBuilder.InsertData(
                table: "nilai_ujian_skl",
                columns: new[] { "id", "detail_skl_id", "mata_pelajaran_id", "nilai" },
                values: new object[,]
                {
                    { 1, 1, 1, 90.0 },
                    { 2, 1, 6, 88.0 },
                    { 3, 1, 8, 85.0 },
                    { 4, 1, 9, 87.0 },
                    { 5, 2, 1, 86.0 },
                    { 6, 2, 6, 87.0 },
                    { 7, 2, 8, 82.0 },
                    { 8, 2, 9, 85.0 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "nilai_ujian_ijazah",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "nilai_ujian_ijazah",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "nilai_ujian_ijazah",
                keyColumn: "id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "nilai_ujian_ijazah",
                keyColumn: "id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "nilai_ujian_ijazah",
                keyColumn: "id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "nilai_ujian_ijazah",
                keyColumn: "id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "nilai_ujian_ijazah",
                keyColumn: "id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "nilai_ujian_ijazah",
                keyColumn: "id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "nilai_ujian_skl",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "nilai_ujian_skl",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "nilai_ujian_skl",
                keyColumn: "id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "nilai_ujian_skl",
                keyColumn: "id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "nilai_ujian_skl",
                keyColumn: "id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "nilai_ujian_skl",
                keyColumn: "id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "nilai_ujian_skl",
                keyColumn: "id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "nilai_ujian_skl",
                keyColumn: "id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "detail_ijazah",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "detail_ijazah",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "detail_skl",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "detail_skl",
                keyColumn: "id",
                keyValue: 2);
        }
    }
}
