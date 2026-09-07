using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AlumniSmartArchive.Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePendingChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 21, 2, 17, 58, 951, DateTimeKind.Utc).AddTicks(5147));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 21, 2, 17, 58, 952, DateTimeKind.Utc).AddTicks(829));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 21, 2, 17, 58, 952, DateTimeKind.Utc).AddTicks(891));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 21, 2, 17, 58, 952, DateTimeKind.Utc).AddTicks(895));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 5,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 21, 2, 17, 58, 952, DateTimeKind.Utc).AddTicks(898));

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 21, 2, 17, 58, 952, DateTimeKind.Utc).AddTicks(7887), new DateTime(2026, 5, 21, 2, 17, 58, 952, DateTimeKind.Utc).AddTicks(7889) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 2,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 21, 2, 17, 58, 954, DateTimeKind.Utc).AddTicks(3147), new DateTime(2026, 5, 21, 2, 17, 58, 954, DateTimeKind.Utc).AddTicks(3149) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 3,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 21, 2, 17, 58, 954, DateTimeKind.Utc).AddTicks(3205), new DateTime(2026, 5, 21, 2, 17, 58, 954, DateTimeKind.Utc).AddTicks(3206) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 4,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 21, 2, 17, 58, 954, DateTimeKind.Utc).AddTicks(3216), new DateTime(2026, 5, 21, 2, 17, 58, 954, DateTimeKind.Utc).AddTicks(3216) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 5,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 21, 2, 17, 58, 954, DateTimeKind.Utc).AddTicks(3302), new DateTime(2026, 5, 21, 2, 17, 58, 954, DateTimeKind.Utc).AddTicks(3302) });

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 21, 2, 17, 58, 952, DateTimeKind.Utc).AddTicks(2511));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 21, 2, 17, 58, 952, DateTimeKind.Utc).AddTicks(3857));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 21, 2, 17, 58, 952, DateTimeKind.Utc).AddTicks(3860));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 21, 2, 17, 58, 952, DateTimeKind.Utc).AddTicks(3861));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 21, 2, 17, 58, 949, DateTimeKind.Utc).AddTicks(7885));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 21, 2, 17, 58, 950, DateTimeKind.Utc).AddTicks(1513));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 21, 2, 17, 58, 950, DateTimeKind.Utc).AddTicks(1518));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 21, 2, 17, 58, 950, DateTimeKind.Utc).AddTicks(1520));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 1,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 21, 2, 17, 58, 951, DateTimeKind.Utc).AddTicks(1388));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 2,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 21, 2, 17, 58, 951, DateTimeKind.Utc).AddTicks(2795));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 3,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 21, 2, 17, 58, 951, DateTimeKind.Utc).AddTicks(2798));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 4,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 21, 2, 17, 58, 951, DateTimeKind.Utc).AddTicks(2799));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
    }
}
