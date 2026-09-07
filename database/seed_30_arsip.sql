-- ============================================================
-- SEED DATA 30 ARSIP PER KATEGORI (SAADA - SMART ALUMNI ARCHIVE)
-- ============================================================
-- Skrip ini menyediakan data dummy 30 pasang data per kategori arsip
-- (Ijazah, SKL, Rapor, Buku Induk, Transkrip) beserta hasil OCR & detailnya.
-- ============================================================

USE `alumni_archive_db`;

-- 1. Insert/Ensure 30 Alumni
INSERT IGNORE INTO `alumni` (`id`, `nisn`, `nis`, `nama_lengkap`, `jenis_kelamin`, `tempat_lahir`, `tahun_lulus`, `tanggal_lahir`, `alamat`, `dibuat_pada`) VALUES
(1, '0021001234', '21001', 'Ahmad Faisal Ramadhan', 'L', 'Malang', 2024, '2005-02-10', 'Jl. Veteran No. 45, Malang', NOW()),
(2, '0021002345', '21002', 'Siti Aminah Putri', 'P', 'Surabaya', 2023, '2006-05-15', 'Jl. Merdeka No. 10, Surabaya', NOW()),
(3, '0021003456', '21003', 'Dewi Lestari', 'P', 'Blitar', 2024, '2006-07-10', 'Jl. Kenanga No. 8, Blitar', NOW()),
(4, '0021004567', '21004', 'Muhammad Rizky Hidayat', 'L', 'Kediri', 2023, '2005-11-20', 'Jl. Ahmad Yani No. 25, Kediri', NOW()),
(5, '0021005678', '21005', 'Nur Aisyah Rahmawati', 'P', 'Malang', 2024, '2006-03-05', 'Jl. Diponegoro No. 3, Malang', NOW()),
(6, '0094032702', '210004', 'Ahmad Danial Madaris', 'L', 'Bogor', 2024, '2006-01-12', 'Jl. Raya Bogor No. 6', NOW()),
(7, '3029821030', '210016', 'Alpia Dwi', 'P', 'Bogor', 2024, '2006-02-14', 'Jl. Raya Bogor No. 7', NOW()),
(8, '0095131024', '210015', 'Alpian Tri Saputra', 'L', 'Bogor', 2024, '2006-03-16', 'Jl. Raya Bogor No. 8', NOW()),
(9, '0098551698', '210019', 'Alya Nur Rahman', 'P', 'Bogor', 2024, '2006-04-18', 'Jl. Raya Bogor No. 9', NOW()),
(10, '0084547605', '220178', 'Amanda Nur Fitriyanti', 'P', 'Bogor', 2024, '2006-05-20', 'Jl. Raya Bogor No. 10', NOW()),
(11, '0087413631', '210026', 'Audya Aryanti Purnama', 'P', 'Bogor', 2024, '2006-06-22', 'Jl. Raya Bogor No. 11', NOW()),
(12, '0096613462', '210041', 'Eko Pratomo', 'L', 'Bogor', 2024, '2006-07-24', 'Jl. Raya Bogor No. 12', NOW()),
(13, '0094081702', '210042', 'Emil Dwi Saputra', 'L', 'Bogor', 2024, '2006-08-26', 'Jl. Raya Bogor No. 13', NOW()),
(14, '0040243855', '210048', 'Fachry Anwar', 'L', 'Bogor', 2024, '2006-09-28', 'Jl. Raya Bogor No. 14', NOW()),
(15, '0085003724', '210055', 'Farid Dika Agus Saputra', 'L', 'Bogor', 2024, '2006-10-10', 'Jl. Raya Bogor No. 15', NOW()),
(16, '0092420290', '210061', 'Frida Hendrawati', 'P', 'Bogor', 2024, '2006-11-12', 'Jl. Raya Bogor No. 16', NOW()),
(17, '0099677891', '210065', 'Indah Maulida', 'P', 'Bogor', 2024, '2006-12-14', 'Jl. Raya Bogor No. 17', NOW()),
(18, '0088129632', '210174', 'Jhan Bunga Lestari', 'P', 'Bogor', 2024, '2006-01-16', 'Jl. Raya Bogor No. 18', NOW()),
(19, '0095126569', '210067', 'Kiara Shafa Azzahra', 'P', 'Bogor', 2024, '2006-02-18', 'Jl. Raya Bogor No. 19', NOW()),
(20, '0092088443', '210071', 'Luna Amelia', 'P', 'Bogor', 2024, '2006-03-20', 'Jl. Raya Bogor No. 20', NOW()),
(21, '0082839608', '210084', 'M. Ardiansyah', 'L', 'Bogor', 2024, '2006-04-22', 'Jl. Raya Bogor No. 21', NOW()),
(22, '0082573905', '210179', 'Maharani', 'P', 'Bogor', 2024, '2006-05-24', 'Jl. Raya Bogor No. 22', NOW()),
(23, '0082573391', '210080', 'Maudy Shafitri', 'P', 'Bogor', 2024, '2006-06-26', 'Jl. Raya Bogor No. 23', NOW()),
(24, '0093869103', '210163', 'Maulana Arlan Firmansyah', 'L', 'Bogor', 2024, '2006-07-28', 'Jl. Raya Bogor No. 24', NOW()),
(25, '0061033508', '210081', 'Meliana', 'P', 'Bogor', 2024, '2006-08-30', 'Jl. Raya Bogor No. 25', NOW()),
(26, '0034813013', '210164', 'Muhammad Ardan Supriatna', 'L', 'Bogor', 2024, '2006-09-02', 'Jl. Raya Bogor No. 26', NOW()),
(27, '0085100545', '210086', 'Muhammad Fahri Nursandi', 'L', 'Bogor', 2024, '2006-10-04', 'Jl. Raya Bogor No. 27', NOW()),
(28, '0097772930', '210088', 'Muhammad Fazri Ramdhani', 'L', 'Bogor', 2024, '2006-11-06', 'Jl. Raya Bogor No. 28', NOW()),
(29, '0072536428', '210094', 'Muhammad Septian Ramadhan', 'L', 'Bogor', 2024, '2006-12-08', 'Jl. Raya Bogor No. 29', NOW()),
(30, '0072693904', '210104', 'Naufal Az Zuhdi', 'L', 'Bogor', 2024, '2006-01-10', 'Jl. Raya Bogor No. 30', NOW());

SELECT 'Seed 30 Alumni Selesai' AS info;
