-- ============================================================
-- DATABASE SCHEMA: ALUMNI SMART ARCHIVE
-- Madrasah Tsanawiyah (MTs)
-- ============================================================
-- Pemodelan data berdasarkan Buku Induk Siswa MTs
-- untuk sistem digitalisasi arsip alumni berbasis OCR
-- ============================================================

-- Tabel Utama: Alumni
CREATE TABLE alumni (
    -- Primary Key
    id INT AUTO_INCREMENT PRIMARY KEY,

-- ========================================
-- 1. IDENTITAS PRIBADI SISWA
-- ========================================
nama_lengkap VARCHAR(255) NOT NULL,
nis VARCHAR(20) NOT NULL UNIQUE,
nisn VARCHAR(20) UNIQUE,
tempat_lahir VARCHAR(100),
tanggal_lahir DATE,
jenis_kelamin ENUM('L', 'P') NOT NULL,
agama ENUM(
    'Islam',
    'Kristen',
    'Katolik',
    'Hindu',
    'Buddha',
    'Konghucu'
),
kewarganegaraan VARCHAR(50) DEFAULT 'Indonesia',
anak_ke INT,
jumlah_saudara INT,

-- ========================================
-- 5. DATA KELULUSAN / ALUMNI (PRIORITAS)
-- ========================================
tahun_lulus YEAR NOT NULL,
nomor_ijazah VARCHAR(50),
nomor_skhun VARCHAR(50),
tanggal_kelulusan DATE,
status_kelulusan ENUM(
    'Lulus',
    'Tidak Lulus',
    'Mengulang'
) DEFAULT 'Lulus',
nilai_akhir DECIMAL(5, 2),
rata_rata DECIMAL(5, 2),

-- ========================================
-- 7. DATA ADMINISTRATIF
-- ========================================
nomor_halaman_buku_induk VARCHAR(20),
tanggal_pencatatan DATE,
nama_kepala_sekolah VARCHAR(255),

-- ========================================
-- METADATA SISTEM
-- ========================================
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
created_by INT,
updated_by INT,

-- Indexes untuk pencarian cepat
INDEX idx_nama (nama_lengkap),
    INDEX idx_nis (nis),
    INDEX idx_nisn (nisn),
    INDEX idx_tahun_lulus (tahun_lulus),
    INDEX idx_tanggal_lahir (tanggal_lahir)
);

-- ========================================
-- 2. DATA ORANG TUA / WALI
-- ========================================
CREATE TABLE orang_tua (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumni_id INT NOT NULL,
    nama_ayah VARCHAR(255),
    pekerjaan_ayah VARCHAR(100),
    nama_ibu VARCHAR(255),
    pekerjaan_ibu VARCHAR(100),
    alamat TEXT,
    nomor_kontak VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (alumni_id) REFERENCES alumni (id) ON DELETE CASCADE,
    INDEX idx_alumni (alumni_id)
);

-- ========================================
-- 3. DATA AWAL MASUK SEKOLAH
-- ========================================
CREATE TABLE data_masuk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumni_id INT NOT NULL,
    asal_sekolah VARCHAR(255),
    tanggal_masuk DATE,
    kelas_awal VARCHAR(10),
    tahun_ajaran_masuk VARCHAR(20),
    nomor_induk_sekolah VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (alumni_id) REFERENCES alumni (id) ON DELETE CASCADE,
    INDEX idx_alumni (alumni_id)
);

-- ========================================
-- 4. RIWAYAT AKADEMIK
-- ========================================
CREATE TABLE riwayat_akademik (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumni_id INT NOT NULL,
    tingkat_kelas ENUM('VII', 'VIII', 'IX') NOT NULL,
    tahun_ajaran VARCHAR(20) NOT NULL,
    keterangan ENUM('Naik', 'Tinggal', 'Pindah') DEFAULT 'Naik',
    catatan_prestasi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (alumni_id) REFERENCES alumni (id) ON DELETE CASCADE,
    INDEX idx_alumni (alumni_id),
    INDEX idx_tingkat (tingkat_kelas)
);

-- ========================================
-- 6. DATA MUTASI (OPSIONAL)
-- ========================================
CREATE TABLE mutasi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumni_id INT NOT NULL,
    jenis_mutasi ENUM('Masuk', 'Keluar') NOT NULL,
    tanggal_mutasi DATE NOT NULL,
    sekolah_asal_tujuan VARCHAR(255),
    alasan_mutasi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (alumni_id) REFERENCES alumni (id) ON DELETE CASCADE,
    INDEX idx_alumni (alumni_id),
    INDEX idx_tanggal (tanggal_mutasi)
);

-- ========================================
-- TABEL ARSIP DOKUMEN
-- ========================================

CREATE TABLE arsip_dokumen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumni_id INT NOT NULL,
    
    jenis_dokumen ENUM('Ijazah', 'SKHU', 'Rapor', 'Transkrip', 'Sertifikat', 'Lainnya') NOT NULL,
    nama_file VARCHAR(255) NOT NULL,
    path_file VARCHAR(500) NOT NULL,
    path_file_processed VARCHAR(500), -- Hasil preprocessing
    ukuran_file BIGINT, -- dalam bytes
    format_file VARCHAR(10), -- jpg, png, pdf

-- OCR Data
ocr_text TEXT,
ocr_confidence DECIMAL(5, 2),
ocr_processed_at TIMESTAMP NULL,

-- Status
status_arsip ENUM(
    'Lengkap',
    'Belum Lengkap',
    'Arsip Hilang',
    'Rusak'
) DEFAULT 'Lengkap',
keterangan TEXT,

-- Metadata
uploaded_by INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (alumni_id) REFERENCES alumni(id) ON DELETE CASCADE,
    INDEX idx_alumni (alumni_id),
    INDEX idx_jenis (jenis_dokumen),
    INDEX idx_status (status_arsip)
);

-- ========================================
-- TABEL RIWAYAT PERUBAHAN (AUDIT LOG)
-- ========================================
CREATE TABLE riwayat_perubahan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
    old_data JSON,
    new_data JSON,
    changed_by INT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_changed_at (changed_at)
);

-- ========================================
-- TABEL USERS (PETUGAS)
-- ========================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role ENUM('Admin', 'Petugas', 'Viewer') DEFAULT 'Petugas',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_role (role)
);

-- ========================================
-- VIEWS UNTUK PENCARIAN CEPAT
-- ========================================

-- View: Data Alumni Lengkap (JOIN semua tabel)
CREATE VIEW v_alumni_lengkap AS
SELECT
    a.id,
    a.nama_lengkap,
    a.nis,
    a.nisn,
    a.tempat_lahir,
    a.tanggal_lahir,
    a.jenis_kelamin,
    a.agama,
    a.tahun_lulus,
    a.nomor_ijazah,
    a.nomor_skhun,
    a.nilai_akhir,
    a.rata_rata,
    ot.nama_ayah,
    ot.nama_ibu,
    ot.alamat,
    ot.nomor_kontak,
    dm.asal_sekolah,
    dm.tanggal_masuk,
    dm.tahun_ajaran_masuk,
    COUNT(DISTINCT ad.id) as jumlah_dokumen,
    GROUP_CONCAT(DISTINCT ad.jenis_dokumen) as jenis_dokumen_tersedia
FROM
    alumni a
    LEFT JOIN orang_tua ot ON a.id = ot.alumni_id
    LEFT JOIN data_masuk dm ON a.id = dm.alumni_id
    LEFT JOIN arsip_dokumen ad ON a.id = ad.alumni_id
GROUP BY
    a.id;

-- View: Statistik Arsip per Tahun
CREATE VIEW v_statistik_tahun AS
SELECT
    tahun_lulus,
    COUNT(*) as total_alumni,
    SUM(
        CASE
            WHEN jenis_kelamin = 'L' THEN 1
            ELSE 0
        END
    ) as total_laki_laki,
    SUM(
        CASE
            WHEN jenis_kelamin = 'P' THEN 1
            ELSE 0
        END
    ) as total_perempuan,
    AVG(nilai_akhir) as rata_rata_nilai,
    COUNT(DISTINCT ad.id) as total_dokumen
FROM alumni a
    LEFT JOIN arsip_dokumen ad ON a.id = ad.alumni_id
GROUP BY
    tahun_lulus
ORDER BY tahun_lulus DESC;

-- ========================================
-- STORED PROCEDURES
-- ========================================

DELIMITER / /

-- Procedure: Cari Alumni (Fuzzy Search Ready)
CREATE PROCEDURE sp_cari_alumni(
    IN p_keyword VARCHAR(255),
    IN p_tahun_lulus YEAR,
    IN p_jenis_dokumen VARCHAR(50),
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        a.id,
        a.nama_lengkap,
        a.nis,
        a.nisn,
        a.tahun_lulus,
        a.tempat_lahir,
        a.tanggal_lahir,
        ad.jenis_dokumen,
        ad.status_arsip,
        ad.path_file
    FROM alumni a
    LEFT JOIN arsip_dokumen ad ON a.id = ad.alumni_id
    WHERE 
        (p_keyword IS NULL OR 
         a.nama_lengkap LIKE CONCAT('%', p_keyword, '%') OR
         a.nis LIKE CONCAT('%', p_keyword, '%') OR
         a.nisn LIKE CONCAT('%', p_keyword, '%'))
    AND (p_tahun_lulus IS NULL OR a.tahun_lulus = p_tahun_lulus)
    AND (p_jenis_dokumen IS NULL OR ad.jenis_dokumen = p_jenis_dokumen)
    ORDER BY a.tahun_lulus DESC, a.nama_lengkap ASC
    LIMIT p_limit OFFSET p_offset;
END //

DELIMITER;

-- ========================================
-- SAMPLE DATA INSERT
-- ========================================

-- Insert sample users
INSERT INTO
    users (
        username,
        password_hash,
        nama_lengkap,
        email,
        role
    )
VALUES (
        'admin',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'Administrator',
        'admin@mts.sch.id',
        'Admin'
    ),
    (
        'petugas1',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'Petugas Arsip 1',
        'petugas1@mts.sch.id',
        'Petugas'
    );

-- ========================================
-- NOTES & DOCUMENTATION
-- ========================================
/*
PRIORITAS DATA UNTUK OCR:
1. Nama Lengkap (PRIMARY)
2. NISN (PRIMARY)
3. Tahun Lulus (PRIMARY)
4. Nomor Ijazah (PRIMARY)
5. Tempat & Tanggal Lahir (PRIMARY)

DATA PENDUKUNG:
- NIS
- Jenis Kelamin
- Agama
- Nomor SKHUN
- Nilai Akhir

FIELD WAJIB (NOT NULL):
- nama_lengkap
- nis
- jenis_kelamin
- tahun_lulus

FIELD OPSIONAL:
- Semua field lainnya dapat NULL untuk fleksibilitas data historis

INDEXES:
- Dibuat pada field yang sering dicari
- Mendukung performa fuzzy search
- Optimasi untuk JOIN operations

FOREIGN KEYS:
- Cascade DELETE untuk menjaga integritas data
- Relasi one-to-many dari alumni ke tabel lain

AUDIT TRAIL:
- Semua perubahan data tercatat di riwayat_perubahan
- Mendukung compliance dan traceability
*/