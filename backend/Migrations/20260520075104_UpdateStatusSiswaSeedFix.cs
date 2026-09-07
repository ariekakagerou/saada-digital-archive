using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AlumniSmartArchive.Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateStatusSiswaSeedFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 50, 58, 253, DateTimeKind.Utc).AddTicks(9349));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 50, 58, 255, DateTimeKind.Utc).AddTicks(1930));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 50, 58, 255, DateTimeKind.Utc).AddTicks(1964));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 50, 58, 255, DateTimeKind.Utc).AddTicks(2399));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 5,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 50, 58, 255, DateTimeKind.Utc).AddTicks(2418));

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 7, 50, 58, 258, DateTimeKind.Utc).AddTicks(4215), new DateTime(2026, 5, 20, 7, 50, 58, 258, DateTimeKind.Utc).AddTicks(4224) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 2,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 7, 50, 58, 263, DateTimeKind.Utc).AddTicks(3157), new DateTime(2026, 5, 20, 7, 50, 58, 263, DateTimeKind.Utc).AddTicks(3170) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 3,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 7, 50, 58, 263, DateTimeKind.Utc).AddTicks(3224), new DateTime(2026, 5, 20, 7, 50, 58, 263, DateTimeKind.Utc).AddTicks(3225) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 4,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 7, 50, 58, 263, DateTimeKind.Utc).AddTicks(3401), new DateTime(2026, 5, 20, 7, 50, 58, 263, DateTimeKind.Utc).AddTicks(3402) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 5,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 7, 50, 58, 263, DateTimeKind.Utc).AddTicks(3418), new DateTime(2026, 5, 20, 7, 50, 58, 263, DateTimeKind.Utc).AddTicks(3419) });

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 50, 58, 255, DateTimeKind.Utc).AddTicks(7023));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 50, 58, 256, DateTimeKind.Utc).AddTicks(2366));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 50, 58, 256, DateTimeKind.Utc).AddTicks(2376));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 50, 58, 256, DateTimeKind.Utc).AddTicks(3795));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 50, 58, 247, DateTimeKind.Utc).AddTicks(8851));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 50, 58, 249, DateTimeKind.Utc).AddTicks(3129));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 50, 58, 249, DateTimeKind.Utc).AddTicks(3144));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 50, 58, 249, DateTimeKind.Utc).AddTicks(3150));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 1,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 7, 50, 58, 252, DateTimeKind.Utc).AddTicks(8946));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 2,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 7, 50, 58, 253, DateTimeKind.Utc).AddTicks(4081));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 3,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 7, 50, 58, 253, DateTimeKind.Utc).AddTicks(4090));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 4,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 7, 50, 58, 253, DateTimeKind.Utc).AddTicks(4093));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 45, 7, 558, DateTimeKind.Utc).AddTicks(7976));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 45, 7, 559, DateTimeKind.Utc).AddTicks(5640));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 45, 7, 559, DateTimeKind.Utc).AddTicks(5721));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 45, 7, 559, DateTimeKind.Utc).AddTicks(5727));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 5,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 45, 7, 559, DateTimeKind.Utc).AddTicks(5731));

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 7, 45, 7, 560, DateTimeKind.Utc).AddTicks(6075), new DateTime(2026, 5, 20, 7, 45, 7, 560, DateTimeKind.Utc).AddTicks(6079) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 2,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 7, 45, 7, 562, DateTimeKind.Utc).AddTicks(8478), new DateTime(2026, 5, 20, 7, 45, 7, 562, DateTimeKind.Utc).AddTicks(8480) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 3,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 7, 45, 7, 562, DateTimeKind.Utc).AddTicks(8564), new DateTime(2026, 5, 20, 7, 45, 7, 562, DateTimeKind.Utc).AddTicks(8565) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 4,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 7, 45, 7, 562, DateTimeKind.Utc).AddTicks(8581), new DateTime(2026, 5, 20, 7, 45, 7, 562, DateTimeKind.Utc).AddTicks(8582) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 5,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 7, 45, 7, 562, DateTimeKind.Utc).AddTicks(8592), new DateTime(2026, 5, 20, 7, 45, 7, 562, DateTimeKind.Utc).AddTicks(8592) });

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 45, 7, 559, DateTimeKind.Utc).AddTicks(8037));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 45, 7, 560, DateTimeKind.Utc).AddTicks(281));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 45, 7, 560, DateTimeKind.Utc).AddTicks(287));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 45, 7, 560, DateTimeKind.Utc).AddTicks(289));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 45, 7, 554, DateTimeKind.Utc).AddTicks(2229));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 45, 7, 554, DateTimeKind.Utc).AddTicks(7654));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 45, 7, 554, DateTimeKind.Utc).AddTicks(7662));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 7, 45, 7, 554, DateTimeKind.Utc).AddTicks(7665));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 1,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 7, 45, 7, 558, DateTimeKind.Utc).AddTicks(1707));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 2,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 7, 45, 7, 558, DateTimeKind.Utc).AddTicks(4015));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 3,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 7, 45, 7, 558, DateTimeKind.Utc).AddTicks(4020));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 4,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 7, 45, 7, 558, DateTimeKind.Utc).AddTicks(4022));
        }
    }
}
