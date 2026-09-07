using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AlumniSmartArchive.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAlumniKelasIXBAndTracerStudy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "alumni",
                columns: new[] { "id", "alamat", "tanggal_lahir", "dibuat_pada", "nama_lengkap", "tahun_lulus", "jenis_kelamin", "nis", "nisn", "tempat_lahir" },
                values: new object[,]
                {
                    { 6, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Ahmad Danial Madaris", 2024, "L", "210004", "0094032702", "" },
                    { 7, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Alpia Dwi", 2024, "P", "210016", "3029821030", "" },
                    { 8, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Alpian Tri Saputra", 2024, "L", "210015", "0095131024", "" },
                    { 9, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Alya Nur Rahman", 2024, "P", "210019", "0098551698", "" },
                    { 10, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Amanda Nur Fitriyanti", 2024, "P", "220178", "0084547605", "" },
                    { 11, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Audya Aryanti Purnama", 2024, "P", "210026", "0087413631", "" },
                    { 12, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Eko Pratomo", 2024, "L", "210041", "0096613462", "" },
                    { 13, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Emil Dwi Saputra", 2024, "L", "210042", "0094081702", "" },
                    { 14, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Fachry Anwar", 2024, "L", "210048", "0040243855", "" },
                    { 15, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Farid Dika Agus Saputra", 2024, "L", "210055", "0085003724", "" },
                    { 16, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Frida Hendrawati", 2024, "P", "210061", "0092420290", "" },
                    { 17, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Indah Maulida", 2024, "P", "210065", "0099677891", "" },
                    { 18, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Jhan Bunga Lestari", 2024, "P", "210174", "0088129632", "" },
                    { 19, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Kiara Shafa Azzahra", 2024, "P", "210067", "0095126569", "" },
                    { 20, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Luna Amelia", 2024, "P", "210071", "0092088443", "" },
                    { 21, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "M. Ardiansyah", 2024, "L", "210084", "0082839608", "" },
                    { 22, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Maharani", 2024, "P", "210179", "0082573905", "" },
                    { 23, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Maudy Shafitri", 2024, "P", "210080", "0082573391", "" },
                    { 24, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Maulana Arlan Firmansyah", 2024, "L", "210163", "0093869103", "" },
                    { 25, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Meliana", 2024, "P", "210081", "0061033508", "" },
                    { 26, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Muhammad Ardan Supriatna", 2024, "L", "210164", "0034813013", "" },
                    { 27, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Muhammad Fahri Nursandi", 2024, "L", "210086", "0085100545", "" },
                    { 28, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Muhammad Fazri Ramdhani", 2024, "L", "210088", "0097772930", "" },
                    { 29, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Muhammad Septian Ramadhan", 2024, "L", "210094", "0072536428", "" },
                    { 30, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Naufal Az Zuhdi", 2024, "L", "210104", "0072693904", "" },
                    { 31, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Putri Ariskha", 2024, "P", "210110", "0097743162", "" },
                    { 32, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Quenna Valencia", 2024, "P", "210111", "0087189022", "" },
                    { 33, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Rafady Faetza", 2024, "L", "210114", "0084683986", "" },
                    { 34, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Raisya Fauziah", 2024, "P", "210116", "0098703244", "" },
                    { 35, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Rehan Alfahrezi", 2024, "L", "210121", "0096359612", "" },
                    { 36, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Rendi Bagaskara", 2024, "L", "210123", "0075509860", "" },
                    { 37, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Rendy Alfiano", 2024, "L", "210168", "0094094143", "" },
                    { 38, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Reza Perdana Hakim", 2024, "L", "210127", "0082816477", "" },
                    { 39, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Rezita Gestiyanti", 2024, "P", "210128", "0084172704", "" },
                    { 40, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Ririn Alpiana", 2024, "P", "210132", "0084380378", "" },
                    { 41, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Rizki Arafah", 2024, "P", "210134", "0097621952", "" },
                    { 42, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Salsabila", 2024, "P", "210136", "0092409057", "" },
                    { 43, "", null, new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Salwa", 2024, "P", "210137", "0084142408", "" }
                });

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 2,
                columns: new[] { "deskripsi", "nama_kategori" },
                values: new object[] { "Surat Keterangan Lulus", "SKL (Surat Keterangan Lulus)" });

            migrationBuilder.InsertData(
                table: "tracer_study",
                columns: new[] { "id", "alamat_instansi", "alumni_id", "catatan_tambahan", "diperbarui_pada", "jabatan_atau_jurusan", "nama_instansi", "status_saat_ini", "tahun_mulai" },
                values: new object[,]
                {
                    { 1, "", 6, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "Sekolah Nusantara", "Melanjutkan ke SMA/SMK", "2024" },
                    { 2, "", 7, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMK Palupah", "Melanjutkan ke SMA/SMK", "2024" },
                    { 3, "", 8, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMA 3 Cibinong", "Melanjutkan ke SMA/SMK", "2024" },
                    { 4, "", 9, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMK Master", "Melanjutkan ke SMA/SMK", "2024" },
                    { 5, "", 10, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMK Paci 3", "Melanjutkan ke SMA/SMK", "2024" },
                    { 6, "", 11, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMAN 2 Bogor", "Melanjutkan ke SMA/SMK", "2024" },
                    { 7, "", 12, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMAN 2 Bogor", "Melanjutkan ke SMA/SMK", "2024" },
                    { 8, "", 13, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMK Master", "Melanjutkan ke SMA/SMK", "2024" },
                    { 9, "", 14, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMK Sirnawati", "Melanjutkan ke SMA/SMK", "2024" },
                    { 10, "", 15, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMK Sirnawati", "Melanjutkan ke SMA/SMK", "2024" },
                    { 11, "", 16, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMK Nasarports", "Melanjutkan ke SMA/SMK", "2024" },
                    { 12, "", 17, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SIKER 2 Bogor", "Melanjutkan ke SMA/SMK", "2024" },
                    { 13, "", 18, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMK RG13", "Melanjutkan ke SMA/SMK", "2024" },
                    { 14, "", 19, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMK Pari 3", "Melanjutkan ke SMA/SMK", "2024" },
                    { 15, "", 20, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMK Nusantara", "Melanjutkan ke SMA/SMK", "2024" },
                    { 16, "", 21, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMK Nusantara", "Melanjutkan ke SMA/SMK", "2024" },
                    { 17, "", 22, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMKN 1 Cibinong", "Melanjutkan ke SMA/SMK", "2024" },
                    { 18, "", 23, "Kelas IX-B TA 2023-2024 (perlu verifikasi)", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMPN Pari 3", "Melanjutkan ke SMA/SMK", "2024" },
                    { 19, "", 24, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMK Master", "Melanjutkan ke SMA/SMK", "2024" },
                    { 20, "", 25, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMK Pari 3", "Melanjutkan ke SMA/SMK", "2024" },
                    { 21, "", 26, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMAN 2 Bogor", "Melanjutkan ke SMA/SMK", "2024" },
                    { 22, "", 27, "Kelas IX-B TA 2023-2024 (kolom ket kosong)", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "", "Tidak Diketahui", "2024" },
                    { 23, "", 28, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMK Nusantara", "Melanjutkan ke SMA/SMK", "2024" },
                    { 24, "", 29, "Kelas IX-B TA 2023-2024 (kolom ket kosong)", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "", "Tidak Diketahui", "2024" },
                    { 25, "", 30, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMAN 8 Bogor", "Melanjutkan ke SMA/SMK", "2024" },
                    { 26, "", 31, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMK Kertahesna Cisa", "Melanjutkan ke SMA/SMK", "2024" },
                    { 27, "", 32, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMAN 2 Cibinong", "Melanjutkan ke SMA/SMK", "2024" },
                    { 28, "", 33, "Kelas IX-B TA 2023-2024 (kolom ket kosong)", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "", "Tidak Diketahui", "2024" },
                    { 29, "", 34, "Kelas IX-B TA 2023-2024 (kolom ket kosong)", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "", "Tidak Diketahui", "2024" },
                    { 30, "", 35, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMF Pari 1", "Melanjutkan ke SMA/SMK", "2024" },
                    { 31, "", 36, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMK Al-Iqra", "Melanjutkan ke SMA/SMK", "2024" },
                    { 32, "", 37, "Kelas IX-B TA 2023-2024 (perlu verifikasi nama sekolah)", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SHK BD", "Melanjutkan ke SMA/SMK", "2024" },
                    { 33, "", 38, "Kelas IX-B TA 2023-2024 (kolom ket kosong)", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "", "Tidak Diketahui", "2024" },
                    { 34, "", 39, "Kelas IX-B TA 2023-2024 (kolom ket kosong)", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "", "Tidak Diketahui", "2024" },
                    { 35, "", 40, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMK Pari 3", "Melanjutkan ke SMA/SMK", "2024" },
                    { 36, "", 41, "Kelas IX-B TA 2023-2024", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "SMK Alati", "Melanjutkan ke SMA/SMK", "2024" },
                    { 37, "", 42, "Kelas IX-B TA 2023-2024 (kolom ket kosong)", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "", "Tidak Diketahui", "2024" },
                    { 38, "", 43, "Kelas IX-B TA 2023-2024 (kolom ket kosong)", new DateTime(2026, 6, 28, 0, 0, 0, 0, DateTimeKind.Utc), "", "", "Tidak Diketahui", "2024" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 31);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 32);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 33);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 34);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 35);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 36);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 37);

            migrationBuilder.DeleteData(
                table: "tracer_study",
                keyColumn: "id",
                keyValue: 38);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 31);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 32);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 33);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 34);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 35);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 36);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 37);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 38);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 39);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 40);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 41);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 42);

            migrationBuilder.DeleteData(
                table: "alumni",
                keyColumn: "id",
                keyValue: 43);

            migrationBuilder.UpdateData(
                table: "kategori_arsip",
                keyColumn: "id",
                keyValue: 2,
                columns: new[] { "deskripsi", "nama_kategori" },
                values: new object[] { "Surat Keterangan Hasil Ujian Nasional", "SKHUN" });
        }
    }
}
