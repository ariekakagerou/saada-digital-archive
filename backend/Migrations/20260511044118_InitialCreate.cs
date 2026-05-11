using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AlumniSmartArchive.Backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "alumni",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    nisn = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nis = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nama_lengkap = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    jenis_kelamin = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tempat_lahir = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tahun_lulus = table.Column<int>(type: "int", nullable: false),
                    tanggal_lahir = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    alamat = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dibuat_pada = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_alumni", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "kategori_arsip",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    nama_kategori = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    deskripsi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dibuat_pada = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_kategori_arsip", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "pengguna",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    nama_pengguna = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nama_lengkap = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nip = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    kata_sandi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    peran = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    aktif = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    dibuat_pada = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pengguna", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "arsip",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    alumni_id = table.Column<int>(type: "int", nullable: true),
                    lokasi_file = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tipe_file = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    jenis_arsip = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    status_arsip = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ukuran_file = table.Column<long>(type: "bigint", nullable: false),
                    pengunggah = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    diunggah_pada = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_arsip", x => x.id);
                    table.ForeignKey(
                        name: "FK_arsip_alumni_alumni_id",
                        column: x => x.alumni_id,
                        principalTable: "alumni",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "buku_induk",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    alumni_id = table.Column<int>(type: "int", nullable: false),
                    nis = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nisn = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nama_lengkap = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    jenis_kelamin = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tempat_lahir = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tanggal_lahir = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    agama = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    kewarganegaraan = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nama_ayah = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nama_ibu = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    pekerjaan_ayah = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    pekerjaan_ibu = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    pendidikan_ayah = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    pendidikan_ibu = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    alamat_orang_tua = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    no_hp_wali = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tahun_masuk = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    asal_sekolah = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    kelas_masuk = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    jurusan = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    rata_rata = table.Column<double>(type: "double", nullable: false),
                    prestasi_akademik = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    catatan_kegiatan = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tahun_lulus = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nomor_ijazah = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nomor_skhun = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    status_kelulusan = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email_alumni = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nomor_hp_alumni = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    pekerjaan_sekarang = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    perguruan_tinggi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    alamat_sekarang = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    status_arsip = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    foto = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dibuat_pada = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    diperbarui_pada = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_buku_induk", x => x.id);
                    table.ForeignKey(
                        name: "FK_buku_induk_alumni_alumni_id",
                        column: x => x.alumni_id,
                        principalTable: "alumni",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "mutasi",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    alumni_id = table.Column<int>(type: "int", nullable: false),
                    jenis_mutasi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tanggal_mutasi = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    sekolah_asal_tujuan = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    alasan_mutasi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mutasi", x => x.id);
                    table.ForeignKey(
                        name: "FK_mutasi_alumni_alumni_id",
                        column: x => x.alumni_id,
                        principalTable: "alumni",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "permohonan_dokumen",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    alumni_id = table.Column<int>(type: "int", nullable: false),
                    jenis_dokumen = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tujuan_permohonan = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    jumlah_copy = table.Column<int>(type: "int", nullable: false),
                    status_permohonan = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    keterangan = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tanggal_pengajuan = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    tanggal_selesai = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_permohonan_dokumen", x => x.id);
                    table.ForeignKey(
                        name: "FK_permohonan_dokumen_alumni_alumni_id",
                        column: x => x.alumni_id,
                        principalTable: "alumni",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "tracer_study",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    alumni_id = table.Column<int>(type: "int", nullable: false),
                    status_saat_ini = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nama_instansi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    jabatan_atau_jurusan = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    alamat_instansi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tahun_mulai = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    catatan_tambahan = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    diperbarui_pada = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tracer_study", x => x.id);
                    table.ForeignKey(
                        name: "FK_tracer_study_alumni_alumni_id",
                        column: x => x.alumni_id,
                        principalTable: "alumni",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "log_aktivitas",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    pengguna_id = table.Column<int>(type: "int", nullable: true),
                    nama_pengguna = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    aksi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    target_objek = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    status = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ip_address = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    waktu = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_log_aktivitas", x => x.id);
                    table.ForeignKey(
                        name: "FK_log_aktivitas_pengguna_pengguna_id",
                        column: x => x.pengguna_id,
                        principalTable: "pengguna",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "hasil_ocr",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    arsip_id = table.Column<int>(type: "int", nullable: false),
                    teks_ekstraksi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    skor_akurasi = table.Column<double>(type: "double", nullable: false),
                    status = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_hasil_ocr", x => x.id);
                    table.ForeignKey(
                        name: "FK_hasil_ocr_arsip_arsip_id",
                        column: x => x.arsip_id,
                        principalTable: "arsip",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ekstrakurikuler",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    buku_induk_id = table.Column<int>(type: "int", nullable: false),
                    nama = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    jabatan = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tahun = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ekstrakurikuler", x => x.id);
                    table.ForeignKey(
                        name: "FK_ekstrakurikuler_buku_induk_buku_induk_id",
                        column: x => x.buku_induk_id,
                        principalTable: "buku_induk",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "nilai_semester",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    buku_induk_id = table.Column<int>(type: "int", nullable: false),
                    semester = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    rata_rata = table.Column<double>(type: "double", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nilai_semester", x => x.id);
                    table.ForeignKey(
                        name: "FK_nilai_semester_buku_induk_buku_induk_id",
                        column: x => x.buku_induk_id,
                        principalTable: "buku_induk",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "prestasi_lomba",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    buku_induk_id = table.Column<int>(type: "int", nullable: false),
                    nama_lomba = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tingkat = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tahun = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    juara = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_prestasi_lomba", x => x.id);
                    table.ForeignKey(
                        name: "FK_prestasi_lomba_buku_induk_buku_induk_id",
                        column: x => x.buku_induk_id,
                        principalTable: "buku_induk",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "nilai_mata_pelajaran",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    nilai_semester_id = table.Column<int>(type: "int", nullable: false),
                    nama_mapel = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nilai = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nilai_mata_pelajaran", x => x.id);
                    table.ForeignKey(
                        name: "FK_nilai_mata_pelajaran_nilai_semester_nilai_semester_id",
                        column: x => x.nilai_semester_id,
                        principalTable: "nilai_semester",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "alumni",
                columns: new[] { "id", "alamat", "tanggal_lahir", "dibuat_pada", "nama_lengkap", "tahun_lulus", "jenis_kelamin", "nis", "nisn", "tempat_lahir" },
                values: new object[,]
                {
                    { 1, "Jl. Veteran No. 45, Malang", new DateTime(2005, 2, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 5, 11, 4, 40, 59, 583, DateTimeKind.Utc).AddTicks(6006), "Ahmad Faisal Ramadhan", 2024, "L", "21001", "0021001234", "Malang" },
                    { 2, "Jl. Merdeka No. 10, Surabaya", new DateTime(2006, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 5, 11, 4, 40, 59, 600, DateTimeKind.Utc).AddTicks(8528), "Siti Aminah Putri", 2023, "P", "21002", "0021002345", "Surabaya" },
                    { 3, "Jl. Kenanga No. 8, Blitar", new DateTime(2006, 7, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 5, 11, 4, 40, 59, 600, DateTimeKind.Utc).AddTicks(8606), "Dewi Lestari", 2024, "P", "21003", "0021003456", "Blitar" },
                    { 4, "Jl. Ahmad Yani No. 25, Kediri", new DateTime(2005, 11, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 5, 11, 4, 40, 59, 600, DateTimeKind.Utc).AddTicks(8627), "Muhammad Rizky Hidayat", 2023, "L", "21004", "0021004567", "Kediri" },
                    { 5, "Jl. Diponegoro No. 3, Malang", new DateTime(2006, 3, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 5, 11, 4, 40, 59, 600, DateTimeKind.Utc).AddTicks(8647), "Nur Aisyah Rahmawati", 2024, "P", "21005", "0021005678", "Malang" }
                });

            migrationBuilder.InsertData(
                table: "kategori_arsip",
                columns: new[] { "id", "deskripsi", "dibuat_pada", "nama_kategori" },
                values: new object[,]
                {
                    { 1, "Sertifikat tanda tamat belajar", new DateTime(2026, 5, 11, 4, 40, 59, 602, DateTimeKind.Utc).AddTicks(1356), "Ijazah" },
                    { 2, "Surat Keterangan Hasil Ujian Nasional", new DateTime(2026, 5, 11, 4, 40, 59, 603, DateTimeKind.Utc).AddTicks(657), "SKHUN" },
                    { 3, "Buku laporan pendidikan", new DateTime(2026, 5, 11, 4, 40, 59, 603, DateTimeKind.Utc).AddTicks(678), "Rapor" },
                    { 4, "Halaman detail buku induk siswa", new DateTime(2026, 5, 11, 4, 40, 59, 603, DateTimeKind.Utc).AddTicks(686), "Buku Induk" }
                });

            migrationBuilder.InsertData(
                table: "pengguna",
                columns: new[] { "id", "aktif", "dibuat_pada", "email", "nama_lengkap", "nip", "kata_sandi", "peran", "nama_pengguna" },
                values: new object[,]
                {
                    { 1, true, new DateTime(2026, 5, 11, 4, 40, 59, 563, DateTimeKind.Utc).AddTicks(4587), "admin@mts.sch.id", "Kepala Pengarsipan", "198501012010011001", "admin123", "Admin", "admin" },
                    { 2, true, new DateTime(2026, 5, 11, 4, 40, 59, 568, DateTimeKind.Utc).AddTicks(4632), "operator@mts.sch.id", "Petugas Digitalisasi", "199001012015011001", "admin123", "Operator", "operator" },
                    { 3, true, new DateTime(2026, 5, 11, 4, 40, 59, 568, DateTimeKind.Utc).AddTicks(4852), "penulis@mts.sch.id", "Penulis Buku Induk", "199201012016011001", "admin123", "Penulis", "penulis" },
                    { 4, true, new DateTime(2026, 5, 11, 4, 40, 59, 568, DateTimeKind.Utc).AddTicks(4867), "super@mts.sch.id", "Super Administrator", "198001011995011001", "admin123", "AdminSuper", "superuser" }
                });

            migrationBuilder.InsertData(
                table: "buku_induk",
                columns: new[] { "id", "agama", "alamat_orang_tua", "alamat_sekarang", "alumni_id", "asal_sekolah", "catatan_kegiatan", "dibuat_pada", "diperbarui_pada", "email_alumni", "foto", "jenis_kelamin", "jurusan", "kelas_masuk", "kewarganegaraan", "nama_ayah", "nama_ibu", "nama_lengkap", "nis", "nisn", "no_hp_wali", "nomor_hp_alumni", "nomor_ijazah", "nomor_skhun", "pekerjaan_ayah", "pekerjaan_ibu", "pekerjaan_sekarang", "pendidikan_ayah", "pendidikan_ibu", "perguruan_tinggi", "prestasi_akademik", "rata_rata", "status_arsip", "status_kelulusan", "tahun_lulus", "tahun_masuk", "tanggal_lahir", "tempat_lahir" },
                values: new object[,]
                {
                    { 1, "Islam", "Jl. Veteran No. 45, Malang", "Jl. MT. Haryono No. 165, Malang", 1, "SDN 1 Malang", "Aktif dalam kegiatan OSIS, menjadi perwakilan sekolah dalam berbagai lomba akademik.", new DateTime(2026, 5, 11, 4, 40, 59, 614, DateTimeKind.Utc).AddTicks(164), new DateTime(2026, 5, 11, 4, 40, 59, 614, DateTimeKind.Utc).AddTicks(178), "ahmadfaisal@email.com", null, "L", "-", "VII-A", "WNI", "Rahmat Faisal", "Siti Nurhaliza", "Ahmad Faisal Ramadhan", "21001", "0021001234", "081234567890", "082345678901", "DN-05-7/MTs/001/2024", "SKHUN/MTs/001/2024", "Wiraswasta", "Ibu Rumah Tangga", "Mahasiswa", "S1", "SMA", "Universitas Brawijaya Malang", "Juara 1 Kelas selama 4 semester berturut-turut", 89.900000000000006, "Lengkap", "Lulus", "2024", "2021", "10 Februari 2005", "Malang" },
                    { 2, "Islam", "Jl. Merdeka No. 10, Surabaya", "Jl. Dharmawangsa No. 5, Surabaya", 2, "SDN Kebonsari 1", "Aktif dalam kegiatan literasi dan kesenian sekolah.", new DateTime(2026, 5, 11, 4, 40, 59, 648, DateTimeKind.Utc).AddTicks(986), new DateTime(2026, 5, 11, 4, 40, 59, 648, DateTimeKind.Utc).AddTicks(1167), "sitiaminah@email.com", null, "P", "-", "VII-B", "WNI", "Hasan Basri", "Aminah Wulandari", "Siti Aminah Putri", "21002", "0021002345", "085678901234", "089012345678", "DN-05-7/MTs/045/2023", "SKHUN/MTs/045/2023", "PNS", "Guru", "Mahasiswa", "S2", "S1", "Universitas Airlangga Surabaya", "Lulusan terbaik angkatan 2023 bidang Bahasa Indonesia", 90.799999999999997, "Lengkap", "Lulus", "2023", "2020", "15 Mei 2006", "Surabaya" },
                    { 3, "Islam", "Jl. Kenanga No. 8, Blitar", "Jl. Kenanga No. 8, Blitar", 3, "SDN 2 Blitar", "Anggota aktif PMR.", new DateTime(2026, 5, 11, 4, 40, 59, 649, DateTimeKind.Utc).AddTicks(4544), new DateTime(2026, 5, 11, 4, 40, 59, 649, DateTimeKind.Utc).AddTicks(4553), "", null, "P", "-", "VII-A", "WNI", "Suryadi", "Lestari Dewi", "Dewi Lestari", "21003", "0021003456", "087654321098", "081234000111", "DN-05-7/MTs/003/2024", "SKHUN/MTs/003/2024", "Petani", "Pedagang", "", "SMP", "SMP", "", "-", 82.5, "Belum Lengkap", "Lulus", "2024", "2021", "10 Juli 2006", "Blitar" },
                    { 4, "Islam", "Jl. Ahmad Yani No. 25, Kediri", "Jl. Ahmad Yani No. 25, Kediri", 4, "SDN 5 Kediri", "Aktif di kegiatan Pramuka.", new DateTime(2026, 5, 11, 4, 40, 59, 649, DateTimeKind.Utc).AddTicks(4607), new DateTime(2026, 5, 11, 4, 40, 59, 649, DateTimeKind.Utc).AddTicks(4610), "", null, "L", "-", "VII-C", "WNI", "Rizky Pratama", "Hidayah Sari", "Muhammad Rizky Hidayat", "21004", "0021004567", "081298765432", "", "", "", "TNI", "Ibu Rumah Tangga", "Bekerja", "SMA", "SMA", "", "-", 78.299999999999997, "Arsip Hilang", "Lulus", "2023", "2020", "20 November 2005", "Kediri" },
                    { 5, "Islam", "Jl. Diponegoro No. 3, Malang", "Jl. Semarang No. 5, Malang", 5, "SDN 3 Malang", "Ketua OSIS, aktif lomba sains dan debat.", new DateTime(2026, 5, 11, 4, 40, 59, 649, DateTimeKind.Utc).AddTicks(4641), new DateTime(2026, 5, 11, 4, 40, 59, 649, DateTimeKind.Utc).AddTicks(4643), "nuraisyah@email.com", null, "P", "-", "VII-B", "WNI", "Ahmad Syarif", "Rahmawati", "Nur Aisyah Rahmawati", "21005", "0021005678", "085612345678", "082198765432", "DN-05-7/MTs/005/2024", "SKHUN/MTs/005/2024", "Guru", "PNS", "Mahasiswa", "S1", "S1", "Universitas Negeri Malang", "Peringkat 1 Paralel Kelas IX", 91.200000000000003, "Lengkap", "Lulus", "2024", "2021", "5 Maret 2006", "Malang" }
                });

            migrationBuilder.InsertData(
                table: "ekstrakurikuler",
                columns: new[] { "id", "buku_induk_id", "jabatan", "nama", "tahun" },
                values: new object[,]
                {
                    { 1, 1, "Ketua Regu", "Pramuka", "2021-2022" },
                    { 2, 1, "Anggota", "Karya Ilmiah Remaja", "2022-2023" },
                    { 3, 1, "Sekretaris", "English Club", "2023-2024" },
                    { 4, 2, "Ketua", "PMR", "2021-2022" },
                    { 5, 2, "Anggota", "Teater", "2022-2023" },
                    { 6, 5, "Ketua", "OSIS", "2023-2024" },
                    { 7, 5, "Anggota", "Olimpiade Sains", "2022-2024" }
                });

            migrationBuilder.InsertData(
                table: "nilai_semester",
                columns: new[] { "id", "buku_induk_id", "rata_rata", "semester" },
                values: new object[,]
                {
                    { 1, 1, 86.599999999999994, "Ganjil Kelas VII" },
                    { 2, 1, 88.400000000000006, "Genap Kelas VII" },
                    { 3, 1, 89.0, "Ganjil Kelas VIII" },
                    { 4, 1, 90.400000000000006, "Genap Kelas VIII" },
                    { 5, 1, 92.0, "Ganjil Kelas IX" },
                    { 6, 1, 93.0, "Genap Kelas IX" },
                    { 7, 2, 89.200000000000003, "Ganjil Kelas VII" },
                    { 8, 2, 90.200000000000003, "Genap Kelas VII" },
                    { 9, 2, 90.599999999999994, "Ganjil Kelas VIII" },
                    { 10, 2, 91.599999999999994, "Genap Kelas VIII" },
                    { 11, 2, 91.0, "Ganjil Kelas IX" },
                    { 12, 2, 92.0, "Genap Kelas IX" }
                });

            migrationBuilder.InsertData(
                table: "prestasi_lomba",
                columns: new[] { "id", "buku_induk_id", "juara", "nama_lomba", "tahun", "tingkat" },
                values: new object[,]
                {
                    { 1, 1, "Juara 2", "Olimpiade Matematika Tingkat Kabupaten", "2022", "Kabupaten" },
                    { 2, 1, "Juara 3", "Lomba Karya Ilmiah Remaja", "2023", "Provinsi" },
                    { 3, 1, "Juara 1", "Olimpiade IPA Tingkat Kota", "2024", "Kota" },
                    { 4, 2, "Juara 1", "Lomba Pidato Bahasa Indonesia", "2022", "Kota" },
                    { 5, 2, "Finalis", "Lomba Baca Puisi Nasional", "2023", "Nasional" },
                    { 6, 5, "Juara 1", "Olimpiade Sains Nasional", "2024", "Provinsi" }
                });

            migrationBuilder.InsertData(
                table: "nilai_mata_pelajaran",
                columns: new[] { "id", "nama_mapel", "nilai", "nilai_semester_id" },
                values: new object[,]
                {
                    { 1, "Matematika", 88, 1 },
                    { 2, "Bahasa Indonesia", 90, 1 },
                    { 3, "IPA", 85, 1 },
                    { 4, "IPS", 87, 1 },
                    { 5, "Bahasa Inggris", 83, 1 },
                    { 6, "Matematika", 90, 2 },
                    { 7, "Bahasa Indonesia", 91, 2 },
                    { 8, "IPA", 87, 2 },
                    { 9, "IPS", 89, 2 },
                    { 10, "Bahasa Inggris", 85, 2 },
                    { 11, "Matematika", 92, 3 },
                    { 12, "Bahasa Indonesia", 89, 3 },
                    { 13, "IPA", 90, 3 },
                    { 14, "IPS", 88, 3 },
                    { 15, "Bahasa Inggris", 86, 3 },
                    { 16, "Matematika", 85, 7 },
                    { 17, "Bahasa Indonesia", 92, 7 },
                    { 18, "IPA", 88, 7 },
                    { 19, "IPS", 90, 7 },
                    { 20, "Bahasa Inggris", 91, 7 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_arsip_alumni_id",
                table: "arsip",
                column: "alumni_id");

            migrationBuilder.CreateIndex(
                name: "IX_buku_induk_alumni_id",
                table: "buku_induk",
                column: "alumni_id");

            migrationBuilder.CreateIndex(
                name: "IX_ekstrakurikuler_buku_induk_id",
                table: "ekstrakurikuler",
                column: "buku_induk_id");

            migrationBuilder.CreateIndex(
                name: "IX_hasil_ocr_arsip_id",
                table: "hasil_ocr",
                column: "arsip_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_log_aktivitas_pengguna_id",
                table: "log_aktivitas",
                column: "pengguna_id");

            migrationBuilder.CreateIndex(
                name: "IX_mutasi_alumni_id",
                table: "mutasi",
                column: "alumni_id");

            migrationBuilder.CreateIndex(
                name: "IX_nilai_mata_pelajaran_nilai_semester_id",
                table: "nilai_mata_pelajaran",
                column: "nilai_semester_id");

            migrationBuilder.CreateIndex(
                name: "IX_nilai_semester_buku_induk_id",
                table: "nilai_semester",
                column: "buku_induk_id");

            migrationBuilder.CreateIndex(
                name: "IX_permohonan_dokumen_alumni_id",
                table: "permohonan_dokumen",
                column: "alumni_id");

            migrationBuilder.CreateIndex(
                name: "IX_prestasi_lomba_buku_induk_id",
                table: "prestasi_lomba",
                column: "buku_induk_id");

            migrationBuilder.CreateIndex(
                name: "IX_tracer_study_alumni_id",
                table: "tracer_study",
                column: "alumni_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ekstrakurikuler");

            migrationBuilder.DropTable(
                name: "hasil_ocr");

            migrationBuilder.DropTable(
                name: "kategori_arsip");

            migrationBuilder.DropTable(
                name: "log_aktivitas");

            migrationBuilder.DropTable(
                name: "mutasi");

            migrationBuilder.DropTable(
                name: "nilai_mata_pelajaran");

            migrationBuilder.DropTable(
                name: "permohonan_dokumen");

            migrationBuilder.DropTable(
                name: "prestasi_lomba");

            migrationBuilder.DropTable(
                name: "tracer_study");

            migrationBuilder.DropTable(
                name: "arsip");

            migrationBuilder.DropTable(
                name: "pengguna");

            migrationBuilder.DropTable(
                name: "nilai_semester");

            migrationBuilder.DropTable(
                name: "buku_induk");

            migrationBuilder.DropTable(
                name: "alumni");
        }
    }
}
