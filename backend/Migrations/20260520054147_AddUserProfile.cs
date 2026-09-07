using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AlumniSmartArchive.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddUserProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "profil_pengguna",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    pengguna_id = table.Column<int>(type: "int", nullable: false),
                    no_hp = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nik = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    jenis_kelamin = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tempat_tanggal_lahir = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    alamat_lengkap = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    kota = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    provinsi = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    kode_pos = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nisn = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tahun_masuk = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tahun_lulus = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    jurusan = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    angkatan = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    status_alumni = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    unit_lembaga = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    jabatan = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    darurat_nama = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    darurat_hubungan = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    darurat_no_hp = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    facebook = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    instagram = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    linkedin = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    website = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    avatar_url = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    diperbarui_pada = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_profil_pengguna", x => x.id);
                    table.ForeignKey(
                        name: "FK_profil_pengguna_pengguna_pengguna_id",
                        column: x => x.pengguna_id,
                        principalTable: "pengguna",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

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
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 41, 20, 486, DateTimeKind.Utc).AddTicks(2562));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 41, 20, 488, DateTimeKind.Utc).AddTicks(634));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 41, 20, 488, DateTimeKind.Utc).AddTicks(669));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 41, 20, 488, DateTimeKind.Utc).AddTicks(675));

            migrationBuilder.CreateIndex(
                name: "IX_profil_pengguna_pengguna_id",
                table: "profil_pengguna",
                column: "pengguna_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "profil_pengguna");

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 11, 4, 40, 59, 583, DateTimeKind.Utc).AddTicks(6006));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 11, 4, 40, 59, 600, DateTimeKind.Utc).AddTicks(8528));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 11, 4, 40, 59, 600, DateTimeKind.Utc).AddTicks(8606));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 11, 4, 40, 59, 600, DateTimeKind.Utc).AddTicks(8627));

            migrationBuilder.UpdateData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 5,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 11, 4, 40, 59, 600, DateTimeKind.Utc).AddTicks(8647));

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 11, 4, 40, 59, 614, DateTimeKind.Utc).AddTicks(164), new DateTime(2026, 5, 11, 4, 40, 59, 614, DateTimeKind.Utc).AddTicks(178) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 2,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 11, 4, 40, 59, 648, DateTimeKind.Utc).AddTicks(986), new DateTime(2026, 5, 11, 4, 40, 59, 648, DateTimeKind.Utc).AddTicks(1167) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 3,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 11, 4, 40, 59, 649, DateTimeKind.Utc).AddTicks(4544), new DateTime(2026, 5, 11, 4, 40, 59, 649, DateTimeKind.Utc).AddTicks(4553) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 4,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 11, 4, 40, 59, 649, DateTimeKind.Utc).AddTicks(4607), new DateTime(2026, 5, 11, 4, 40, 59, 649, DateTimeKind.Utc).AddTicks(4610) });

            migrationBuilder.UpdateData(
                table: "buku_induk",
                keyColumn: "id",
                keyValue: 5,
                columns: new[] { "dibuat_pada", "diperbarui_pada" },
                values: new object[] { new DateTime(2026, 5, 11, 4, 40, 59, 649, DateTimeKind.Utc).AddTicks(4641), new DateTime(2026, 5, 11, 4, 40, 59, 649, DateTimeKind.Utc).AddTicks(4643) });

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 11, 4, 40, 59, 602, DateTimeKind.Utc).AddTicks(1356));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 11, 4, 40, 59, 603, DateTimeKind.Utc).AddTicks(657));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 11, 4, 40, 59, 603, DateTimeKind.Utc).AddTicks(678));

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 11, 4, 40, 59, 603, DateTimeKind.Utc).AddTicks(686));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 1,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 11, 4, 40, 59, 563, DateTimeKind.Utc).AddTicks(4587));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 11, 4, 40, 59, 568, DateTimeKind.Utc).AddTicks(4632));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 11, 4, 40, 59, 568, DateTimeKind.Utc).AddTicks(4852));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 11, 4, 40, 59, 568, DateTimeKind.Utc).AddTicks(4867));
        }
    }
}
