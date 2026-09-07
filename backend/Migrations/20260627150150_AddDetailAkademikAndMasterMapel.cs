using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AlumniSmartArchive.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddDetailAkademikAndMasterMapel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "detail_ijazah",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    alumni_id = table.Column<int>(type: "int", nullable: false),
                    nomor_ijazah = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tanggal_penerbitan = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    nama_kepala_madrasah = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    rata_rata_nilai = table.Column<double>(type: "double", nullable: false),
                    dibuat_pada = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_detail_ijazah", x => x.id);
                    table.ForeignKey(
                        name: "FK_detail_ijazah_alumni_alumni_id",
                        column: x => x.alumni_id,
                        principalTable: "alumni",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "detail_legger_tambahan",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    nilai_semester_id = table.Column<int>(type: "int", nullable: false),
                    kehadiran_sakit = table.Column<int>(type: "int", nullable: false),
                    kehadiran_izin = table.Column<int>(type: "int", nullable: false),
                    kehadiran_alfa = table.Column<int>(type: "int", nullable: false),
                    sikap_spiritual = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    sikap_sosial = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    catatan_wali_kelas = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dibuat_pada = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_detail_legger_tambahan", x => x.id);
                    table.ForeignKey(
                        name: "FK_detail_legger_tambahan_nilai_semester_nilai_semester_id",
                        column: x => x.nilai_semester_id,
                        principalTable: "nilai_semester",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "detail_skl",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    alumni_id = table.Column<int>(type: "int", nullable: false),
                    nomor_skl = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nomor_peserta = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tanggal_terbit = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    rata_rata_nilai = table.Column<double>(type: "double", nullable: false),
                    dibuat_pada = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_detail_skl", x => x.id);
                    table.ForeignKey(
                        name: "FK_detail_skl_alumni_alumni_id",
                        column: x => x.alumni_id,
                        principalTable: "alumni",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "mata_pelajaran",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    kode_mapel = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nama_mapel = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    kategori = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dibuat_pada = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mata_pelajaran", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "nilai_ujian_ijazah",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    detail_ijazah_id = table.Column<int>(type: "int", nullable: false),
                    mata_pelajaran_id = table.Column<int>(type: "int", nullable: false),
                    nilai = table.Column<double>(type: "double", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nilai_ujian_ijazah", x => x.id);
                    table.ForeignKey(
                        name: "FK_nilai_ujian_ijazah_detail_ijazah_detail_ijazah_id",
                        column: x => x.detail_ijazah_id,
                        principalTable: "detail_ijazah",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_nilai_ujian_ijazah_mata_pelajaran_mata_pelajaran_id",
                        column: x => x.mata_pelajaran_id,
                        principalTable: "mata_pelajaran",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "nilai_ujian_skl",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    detail_skl_id = table.Column<int>(type: "int", nullable: false),
                    mata_pelajaran_id = table.Column<int>(type: "int", nullable: false),
                    nilai = table.Column<double>(type: "double", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nilai_ujian_skl", x => x.id);
                    table.ForeignKey(
                        name: "FK_nilai_ujian_skl_detail_skl_detail_skl_id",
                        column: x => x.detail_skl_id,
                        principalTable: "detail_skl",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_nilai_ujian_skl_mata_pelajaran_mata_pelajaran_id",
                        column: x => x.mata_pelajaran_id,
                        principalTable: "mata_pelajaran",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "mata_pelajaran",
                columns: new[] { "id", "dibuat_pada", "kategori", "kode_mapel", "nama_mapel" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc), "Agama", "QH", "Al-Qur'an Hadis" },
                    { 2, new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc), "Agama", "AA", "Akidah Akhlak" },
                    { 3, new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc), "Agama", "FIK", "Fikih" },
                    { 4, new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc), "Agama", "SKI", "Sejarah Kebudayaan Islam" },
                    { 5, new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc), "Umum", "PPKn", "Pendidikan Pancasila dan Kewarganegaraan" },
                    { 6, new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc), "Umum", "BIND", "Bahasa Indonesia" },
                    { 7, new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc), "Umum", "BAR", "Bahasa Arab" },
                    { 8, new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc), "Umum", "MTK", "Matematika" },
                    { 9, new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc), "Umum", "IPA", "Ilmu Pengetahuan Alam" },
                    { 10, new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc), "Umum", "IPS", "Ilmu Pengetahuan Sosial" },
                    { 11, new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc), "Umum", "BING", "Bahasa Inggris" },
                    { 12, new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc), "Umum", "SB", "Seni Budaya" },
                    { 13, new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc), "Umum", "PJOK", "Pendidikan Jasmani, Olahraga, dan Kesehatan" },
                    { 14, new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc), "Umum", "PRKTI", "Prakarya dan Informatika" },
                    { 15, new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc), "Muatan Lokal", "BSND", "Muatan Lokal Bahasa Sunda" },
                    { 16, new DateTime(2026, 6, 27, 0, 0, 0, 0, DateTimeKind.Utc), "Muatan Lokal", "BTHQ", "Muatan Lokal Baca Tulis dan Hafalan Al-Qur'an" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_detail_ijazah_alumni_id",
                table: "detail_ijazah",
                column: "alumni_id");

            migrationBuilder.CreateIndex(
                name: "IX_detail_legger_tambahan_nilai_semester_id",
                table: "detail_legger_tambahan",
                column: "nilai_semester_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_detail_skl_alumni_id",
                table: "detail_skl",
                column: "alumni_id");

            migrationBuilder.CreateIndex(
                name: "IX_nilai_ujian_ijazah_detail_ijazah_id",
                table: "nilai_ujian_ijazah",
                column: "detail_ijazah_id");

            migrationBuilder.CreateIndex(
                name: "IX_nilai_ujian_ijazah_mata_pelajaran_id",
                table: "nilai_ujian_ijazah",
                column: "mata_pelajaran_id");

            migrationBuilder.CreateIndex(
                name: "IX_nilai_ujian_skl_detail_skl_id",
                table: "nilai_ujian_skl",
                column: "detail_skl_id");

            migrationBuilder.CreateIndex(
                name: "IX_nilai_ujian_skl_mata_pelajaran_id",
                table: "nilai_ujian_skl",
                column: "mata_pelajaran_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "detail_legger_tambahan");

            migrationBuilder.DropTable(
                name: "nilai_ujian_ijazah");

            migrationBuilder.DropTable(
                name: "nilai_ujian_skl");

            migrationBuilder.DropTable(
                name: "detail_ijazah");

            migrationBuilder.DropTable(
                name: "detail_skl");

            migrationBuilder.DropTable(
                name: "mata_pelajaran");
        }
    }
}
