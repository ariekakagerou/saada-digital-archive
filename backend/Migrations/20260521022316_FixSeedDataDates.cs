using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AlumniSmartArchive.Backend.Migrations
{
    /// <inheritdoc />
    public partial class FixSeedDataDates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 5,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 2,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 3,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 4,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 5,
                columns: new[] { "catatan_kegiatan", "dibuat_pada", "diperbarui_pada" },
                values: new object[] { "Ketua OSIS, aktif lomba sains and debat.", new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 1,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 2,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 3,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 4,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
                columns: new[] { "catatan_kegiatan", "dibuat_pada", "diperbarui_pada" },
                values: new object[] { "Ketua OSIS, aktif lomba sains dan debat.", new DateTime(2026, 5, 21, 2, 17, 58, 954, DateTimeKind.Utc).AddTicks(3302), new DateTime(2026, 5, 21, 2, 17, 58, 954, DateTimeKind.Utc).AddTicks(3302) });

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
    }
}
