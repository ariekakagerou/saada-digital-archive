using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AlumniSmartArchive.Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateStatusSiswaSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 59, 3, 606, DateTimeKind.Utc).AddTicks(9928));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 59, 3, 608, DateTimeKind.Utc).AddTicks(4573));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 59, 3, 608, DateTimeKind.Utc).AddTicks(4735));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 59, 3, 608, DateTimeKind.Utc).AddTicks(4746));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 5,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 59, 3, 608, DateTimeKind.Utc).AddTicks(4754));

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 6, 59, 3, 610, DateTimeKind.Utc).AddTicks(4856), new DateTime(2026, 5, 20, 6, 59, 3, 610, DateTimeKind.Utc).AddTicks(4864) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 2,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 6, 59, 3, 615, DateTimeKind.Utc).AddTicks(207), new DateTime(2026, 5, 20, 6, 59, 3, 615, DateTimeKind.Utc).AddTicks(209) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 3,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 6, 59, 3, 615, DateTimeKind.Utc).AddTicks(378), new DateTime(2026, 5, 20, 6, 59, 3, 615, DateTimeKind.Utc).AddTicks(380) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 4,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 6, 59, 3, 615, DateTimeKind.Utc).AddTicks(410), new DateTime(2026, 5, 20, 6, 59, 3, 615, DateTimeKind.Utc).AddTicks(411) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 5,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 6, 59, 3, 615, DateTimeKind.Utc).AddTicks(700), new DateTime(2026, 5, 20, 6, 59, 3, 615, DateTimeKind.Utc).AddTicks(701) });

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 59, 3, 608, DateTimeKind.Utc).AddTicks(9135));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 59, 3, 609, DateTimeKind.Utc).AddTicks(3107));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 59, 3, 609, DateTimeKind.Utc).AddTicks(3116));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 59, 3, 609, DateTimeKind.Utc).AddTicks(3120));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 59, 3, 579, DateTimeKind.Utc).AddTicks(7738));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 59, 3, 580, DateTimeKind.Utc).AddTicks(7000));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 59, 3, 580, DateTimeKind.Utc).AddTicks(7020));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 59, 3, 580, DateTimeKind.Utc).AddTicks(7024));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 1,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 6, 59, 3, 605, DateTimeKind.Utc).AddTicks(1548));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 2,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 6, 59, 3, 606, DateTimeKind.Utc).AddTicks(226));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 3,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 6, 59, 3, 606, DateTimeKind.Utc).AddTicks(250));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 4,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 6, 59, 3, 606, DateTimeKind.Utc).AddTicks(254));
        }
    }
}
