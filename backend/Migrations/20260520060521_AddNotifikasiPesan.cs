using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AlumniSmartArchive.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddNotifikasiPesan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "notifikasi",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    pengguna_id = table.Column<int>(type: "int", nullable: true),
                    judul = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    pesan = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tipe = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dibaca = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    dibuat_pada = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notifikasi", x => x.id);
                    table.ForeignKey(
                        name: "FK_notifikasi_pengguna_pengguna_id",
                        column: x => x.pengguna_id,
                        principalTable: "pengguna",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "pesan_bantuan",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    nama_pengirim = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email_pengirim = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    subjek = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    pesan = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    status = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dibuat_pada = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pesan_bantuan", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

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

            migrationBuilder.CreateIndex(
                name: "IX_notifikasi_pengguna_id",
                table: "notifikasi",
                column: "pengguna_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "notifikasi");

            migrationBuilder.DropTable(
                name: "pesan_bantuan");

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
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 58, 32, 833, DateTimeKind.Utc).AddTicks(3712));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 2,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 58, 32, 834, DateTimeKind.Utc).AddTicks(9411));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 3,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 58, 32, 834, DateTimeKind.Utc).AddTicks(9434));

            migrationBuilder.UpdateData(
                table: "pengguna",
                keyColumn: "id",
                keyValue: 4,
                column: "dibuat_pada",
                value: new DateTime(2026, 5, 20, 5, 58, 32, 834, DateTimeKind.Utc).AddTicks(9442));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 1,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 5, 58, 32, 838, DateTimeKind.Utc).AddTicks(9628));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 2,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 5, 58, 32, 839, DateTimeKind.Utc).AddTicks(4332));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 3,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 5, 58, 32, 839, DateTimeKind.Utc).AddTicks(4485));

            migrationBuilder.UpdateData(
                table: "profil_pengguna",
                keyColumn: "id",
                keyValue: 4,
                column: "diperbarui_pada",
                value: new DateTime(2026, 5, 20, 5, 58, 32, 839, DateTimeKind.Utc).AddTicks(4491));
        }
    }
}
