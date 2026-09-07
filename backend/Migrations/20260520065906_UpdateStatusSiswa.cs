using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AlumniSmartArchive.Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateStatusSiswa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "status_kelulusan",
                table: "buku_induk",
                newName: "status_siswa");

            migrationBuilder.AddColumn<string>(
                name: "keterangan_status",
                table: "buku_induk",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

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
                columns: new[] { "dibuat_pada", "diperbarui_pada", "keterangan_status" },
                values: new object[] { new DateTime(2026, 5, 20, 6, 59, 3, 610, DateTimeKind.Utc).AddTicks(4856), new DateTime(2026, 5, 20, 6, 59, 3, 610, DateTimeKind.Utc).AddTicks(4864), "" });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 2,
                columns: new[] { "dibuat_pada", "diperbarui_pada", "keterangan_status" },
                values: new object[] { new DateTime(2026, 5, 20, 6, 59, 3, 615, DateTimeKind.Utc).AddTicks(207), new DateTime(2026, 5, 20, 6, 59, 3, 615, DateTimeKind.Utc).AddTicks(209), "" });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 3,
                columns: new[] { "dibuat_pada", "diperbarui_pada", "keterangan_status" },
                values: new object[] { new DateTime(2026, 5, 20, 6, 59, 3, 615, DateTimeKind.Utc).AddTicks(378), new DateTime(2026, 5, 20, 6, 59, 3, 615, DateTimeKind.Utc).AddTicks(380), "" });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 4,
                columns: new[] { "dibuat_pada", "diperbarui_pada", "keterangan_status" },
                values: new object[] { new DateTime(2026, 5, 20, 6, 59, 3, 615, DateTimeKind.Utc).AddTicks(410), new DateTime(2026, 5, 20, 6, 59, 3, 615, DateTimeKind.Utc).AddTicks(411), "" });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 5,
                columns: new[] { "dibuat_pada", "diperbarui_pada", "keterangan_status" },
                values: new object[] { new DateTime(2026, 5, 20, 6, 59, 3, 615, DateTimeKind.Utc).AddTicks(700), new DateTime(2026, 5, 20, 6, 59, 3, 615, DateTimeKind.Utc).AddTicks(701), "" });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "keterangan_status",
                table: "buku_induk");

            migrationBuilder.RenameColumn(
                name: "status_siswa",
                table: "buku_induk",
                newName: "status_kelulusan");

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 5, 16, 945, DateTimeKind.Utc).AddTicks(7340));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 5, 16, 946, DateTimeKind.Utc).AddTicks(5563));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 5, 16, 946, DateTimeKind.Utc).AddTicks(5662));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 5, 16, 946, DateTimeKind.Utc).AddTicks(5669));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 5,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 5, 16, 946, DateTimeKind.Utc).AddTicks(5675));

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 6, 5, 16, 947, DateTimeKind.Utc).AddTicks(7311), new DateTime(2026, 5, 20, 6, 5, 16, 947, DateTimeKind.Utc).AddTicks(7315) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 2,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 6, 5, 16, 950, DateTimeKind.Utc).AddTicks(4317), new DateTime(2026, 5, 20, 6, 5, 16, 950, DateTimeKind.Utc).AddTicks(4321) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 3,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 6, 5, 16, 950, DateTimeKind.Utc).AddTicks(4354), new DateTime(2026, 5, 20, 6, 5, 16, 950, DateTimeKind.Utc).AddTicks(4355) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 4,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 6, 5, 16, 950, DateTimeKind.Utc).AddTicks(4451), new DateTime(2026, 5, 20, 6, 5, 16, 950, DateTimeKind.Utc).AddTicks(4452) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 5,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 20, 6, 5, 16, 950, DateTimeKind.Utc).AddTicks(4464), new DateTime(2026, 5, 20, 6, 5, 16, 950, DateTimeKind.Utc).AddTicks(4465) });

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 5, 16, 946, DateTimeKind.Utc).AddTicks(8202));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 5, 16, 947, DateTimeKind.Utc).AddTicks(1191));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 5, 16, 947, DateTimeKind.Utc).AddTicks(1202));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 5, 16, 947, DateTimeKind.Utc).AddTicks(1205));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 5, 16, 942, DateTimeKind.Utc).AddTicks(6751));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 5, 16, 943, DateTimeKind.Utc).AddTicks(3204));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 5, 16, 943, DateTimeKind.Utc).AddTicks(3215));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 6, 5, 16, 943, DateTimeKind.Utc).AddTicks(3219));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 1,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 6, 5, 16, 945, DateTimeKind.Utc).AddTicks(583));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 2,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 6, 5, 16, 945, DateTimeKind.Utc).AddTicks(3313));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 3,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 6, 5, 16, 945, DateTimeKind.Utc).AddTicks(3320));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 4,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 6, 5, 16, 945, DateTimeKind.Utc).AddTicks(3322));
        }
    }
}
