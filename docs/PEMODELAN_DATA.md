# Dokumentasi Pemodelan Data
## Sistem Digitalisasi Arsip Alumni MTs

---

## 📚 Ringkasan Eksekutif

Dokumen ini mendeskripsikan pemodelan data untuk **Sistem Digitalisasi Arsip Alumni Madrasah Tsanawiyah (MTs)** berbasis OCR dan pencarian cerdas. Pemodelan data ini dirancang berdasarkan struktur **Buku Induk Siswa** yang digunakan di MTs sebagai arsip utama sekolah.

### Tujuan Pemodelan Data:
1. Menjadi dasar perancangan database
2. Menentukan field wajib dan opsional
3. Menentukan fokus ekstraksi OCR
4. Mendukung pencarian arsip alumni yang efisien
5. Memfasilitasi validasi identitas alumni

---

## 🗂️ Struktur Data Buku Induk Siswa MTs

### 1. Identitas Pribadi Siswa

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| Nama Lengkap | VARCHAR(255) | ✅ Ya | **PRIORITAS OCR** |
| NIS | VARCHAR(20) | ✅ Ya | Nomor Induk Siswa |
| NISN | VARCHAR(20) | ⚠️ Opsional | **PRIORITAS OCR** - Nomor Induk Siswa Nasional |
| Tempat Lahir | VARCHAR(100) | ⚠️ Opsional | **PRIORITAS OCR** |
| Tanggal Lahir | DATE | ⚠️ Opsional | **PRIORITAS OCR** |
| Jenis Kelamin | ENUM('L','P') | ✅ Ya | Laki-laki / Perempuan |
| Agama | ENUM | ⚠️ Opsional | Islam, Kristen, Katolik, Hindu, Buddha, Konghucu |
| Kewarganegaraan | VARCHAR(50) | ⚠️ Opsional | Default: Indonesia |
| Anak ke- | INT | ⚠️ Opsional | Urutan anak dalam keluarga |
| Jumlah Saudara | INT | ⚠️ Opsional | Total saudara kandung |

### 2. Data Orang Tua / Wali

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| Nama Ayah | VARCHAR(255) | ⚠️ Opsional | Nama lengkap ayah |
| Pekerjaan Ayah | VARCHAR(100) | ⚠️ Opsional | Profesi ayah |
| Nama Ibu | VARCHAR(255) | ⚠️ Opsional | Nama lengkap ibu |
| Pekerjaan Ibu | VARCHAR(100) | ⚠️ Opsional | Profesi ibu |
| Alamat | TEXT | ⚠️ Opsional | Alamat lengkap orang tua/wali |
| Nomor Kontak | VARCHAR(20) | ⚠️ Opsional | Nomor telepon/HP |

**Relasi:** One-to-One dengan tabel `alumni` (1 alumni = 1 data orang tua)

### 3. Data Awal Masuk Sekolah

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| Asal Sekolah | VARCHAR(255) | ⚠️ Opsional | Nama SD asal |
| Tanggal Masuk | DATE | ⚠️ Opsional | Tanggal diterima di MTs |
| Kelas Awal | VARCHAR(10) | ⚠️ Opsional | Biasanya "VII" |
| Tahun Ajaran Masuk | VARCHAR(20) | ⚠️ Opsional | Format: "2021/2022" |
| Nomor Induk Sekolah | VARCHAR(50) | ⚠️ Opsional | Nomor induk saat masuk |

**Relasi:** One-to-One dengan tabel `alumni`

### 4. Riwayat Akademik

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| Tingkat Kelas | ENUM('VII','VIII','IX') | ✅ Ya | Kelas 7, 8, atau 9 |
| Tahun Ajaran | VARCHAR(20) | ✅ Ya | Format: "2021/2022" |
| Keterangan | ENUM | ✅ Ya | Naik / Tinggal / Pindah |
| Catatan Prestasi | TEXT | ⚠️ Opsional | Prestasi akademik/non-akademik |

**Relasi:** One-to-Many dengan tabel `alumni` (1 alumni = 3 riwayat akademik untuk kelas VII, VIII, IX)

### 5. Data Kelulusan / Alumni ⭐ PRIORITAS

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| Tahun Lulus | YEAR | ✅ Ya | **PRIORITAS OCR** |
| Nomor Ijazah | VARCHAR(50) | ⚠️ Opsional | **PRIORITAS OCR** |
| Nomor SKHUN | VARCHAR(50) | ⚠️ Opsional | Surat Keterangan Hasil Ujian Nasional |
| Tanggal Kelulusan | DATE | ⚠️ Opsional | Tanggal wisuda/kelulusan |
| Status Kelulusan | ENUM | ✅ Ya | Lulus / Tidak Lulus / Mengulang |
| Nilai Akhir | DECIMAL(5,2) | ⚠️ Opsional | Nilai ujian akhir |
| Rata-rata | DECIMAL(5,2) | ⚠️ Opsional | Rata-rata nilai keseluruhan |

**Catatan:** Data kelulusan adalah **fokus utama** sistem karena digunakan untuk pencarian alumni.

### 6. Data Mutasi (Opsional)

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| Jenis Mutasi | ENUM('Masuk','Keluar') | ✅ Ya | Mutasi masuk/keluar |
| Tanggal Mutasi | DATE | ✅ Ya | Tanggal mutasi terjadi |
| Sekolah Asal/Tujuan | VARCHAR(255) | ⚠️ Opsional | Nama sekolah asal/tujuan |
| Alasan Mutasi | TEXT | ⚠️ Opsional | Alasan pindah sekolah |

**Relasi:** One-to-Many dengan tabel `alumni` (1 alumni bisa punya beberapa mutasi)

### 7. Data Administratif

| Field | Tipe Data | Wajib | Keterangan |
|-------|-----------|-------|------------|
| Nomor Halaman Buku Induk | VARCHAR(20) | ⚠️ Opsional | Nomor halaman di buku fisik |
| Tanggal Pencatatan | DATE | ⚠️ Opsional | Tanggal data dicatat |
| Nama Kepala Sekolah | VARCHAR(255) | ⚠️ Opsional | Kepala sekolah saat kelulusan |

---

## 🎯 Data Prioritas untuk Sistem Digital

### Field Prioritas Tinggi (untuk OCR)

1. **Nama Lengkap** - Identitas utama
2. **NISN** - Nomor unik nasional
3. **Tahun Lulus** - Filter pencarian utama
4. **Nomor Ijazah** - Validasi dokumen
5. **Tempat & Tanggal Lahir** - Validasi identitas

### Field Prioritas Sedang

- NIS
- Jenis Kelamin
- Agama
- Nomor SKHUN
- Nilai Akhir

### Field Opsional (Pendukung)

- Data orang tua
- Riwayat akademik
- Data mutasi
- Catatan administratif

---

## 🗄️ Struktur Database

### Tabel Utama

```
1. alumni (Tabel Induk)
   - Menyimpan data identitas dan kelulusan
   - Primary Key: id
   - Unique Keys: nis, nisn

2. orang_tua
   - Relasi: alumni_id → alumni.id
   - One-to-One relationship

3. data_masuk
   - Relasi: alumni_id → alumni.id
   - One-to-One relationship

4. riwayat_akademik
   - Relasi: alumni_id → alumni.id
   - One-to-Many relationship

5. mutasi
   - Relasi: alumni_id → alumni.id
   - One-to-Many relationship

6. arsip_dokumen
   - Relasi: alumni_id → alumni.id
   - One-to-Many relationship
   - Menyimpan file scan dan hasil OCR
```

### Tabel Pendukung

```
7. users
   - Manajemen pengguna sistem
   - Role: Admin, Petugas, Viewer

8. riwayat_perubahan
   - Audit log untuk tracking perubahan
   - Menyimpan old_data dan new_data dalam JSON
```

### Entity Relationship Diagram (ERD)

```
┌─────────────┐
│   alumni    │ ◄─┐
│  (Primary)  │   │
└─────────────┘   │
       │          │
       │ 1        │
       │          │
       ├──────────┼─────────────┐
       │          │             │
       │ *        │ *           │ *
       │          │             │
┌──────▼──────┐ ┌─▼──────────┐ ┌▼────────────┐
│ orang_tua   │ │ data_masuk │ │  riwayat_   │
│             │ │            │ │  akademik   │
└─────────────┘ └────────────┘ └─────────────┘

       │ *                      │ *
       │                        │
┌──────▼──────┐          ┌─────▼────────┐
│   mutasi    │          │    arsip_    │
│             │          │   dokumen    │
└─────────────┘          └──────────────┘
```

---

## 🔍 Strategi Pencarian

### 1. Pencarian Exact Match
```sql
SELECT * FROM alumni 
WHERE nis = '12345678' 
   OR nisn = '0012345678';
```

### 2. Pencarian Fuzzy (Levenshtein Distance)
```
Input: "Ahmad Faisal"
Candidates: ["Ahmad Faisal", "Ahmad Faizan", "Muhammad Faisal"]
Threshold: 60%

Results:
- Ahmad Faisal (100% - Exact)
- Ahmad Faizan (85% - Fuzzy)
- Muhammad Faisal (73% - Fuzzy)
```

### 3. Pencarian Multi-Field
```sql
SELECT * FROM alumni 
WHERE nama_lengkap LIKE '%Ahmad%'
   OR nis LIKE '%123%'
   OR nisn LIKE '%123%'
ORDER BY tahun_lulus DESC;
```

### 4. Filter Kombinasi
```sql
SELECT * FROM alumni a
JOIN arsip_dokumen ad ON a.id = ad.alumni_id
WHERE a.tahun_lulus = 2024
  AND ad.jenis_dokumen = 'Ijazah'
  AND ad.status_arsip = 'Lengkap';
```

---

## 📊 Penggunaan Data dalam Sistem

### 1. Ekstraksi OCR
- **Input:** Scan dokumen fisik (Ijazah, SKHU, Rapor)
- **Proses:** 
  - Image preprocessing (grayscale, denoise, threshold)
  - Tesseract OCR extraction
  - Pattern matching untuk field prioritas
- **Output:** Structured data (JSON) + confidence score

### 2. Penyimpanan Database
- Data hasil OCR disimpan di tabel `alumni`
- File scan asli disimpan di `arsip_dokumen`
- Metadata OCR (confidence, processed_at) dicatat

### 3. Pencarian Fuzzy
- Menggunakan Levenshtein Distance algorithm
- Threshold: 60% (configurable)
- Mendukung typo dan variasi penulisan nama

### 4. Validasi Data
- Cross-check antara data OCR dengan data manual
- CER (Character Error Rate) untuk mengukur akurasi
- Manual correction untuk data yang tidak akurat

---

## 📈 Metrik Kualitas Data

### Field Wajib (Must Have)
- Nama Lengkap: 100%
- NIS: 100%
- Jenis Kelamin: 100%
- Tahun Lulus: 100%

### Field Prioritas (Should Have)
- NISN: 80%
- Tempat Lahir: 70%
- Tanggal Lahir: 70%
- Nomor Ijazah: 90%

### Field Opsional (Nice to Have)
- Data Orang Tua: 50%
- Riwayat Akademik: 60%
- Data Mutasi: 20%

---

## 🔐 Keamanan dan Privasi Data

### Data Sensitif
- Data pribadi siswa (nama, tempat/tanggal lahir)
- Data orang tua (nama, alamat, kontak)
- Nomor identitas (NIS, NISN)

### Proteksi
- Enkripsi data sensitif di database
- Role-based access control (RBAC)
- Audit log untuk tracking akses data
- Backup rutin database

### Compliance
- Sesuai dengan UU Perlindungan Data Pribadi
- Consent dari alumni untuk penggunaan data
- Hak akses, koreksi, dan penghapusan data

---

## 📝 Konteks Akademik

Pemodelan data ini digunakan sebagai dasar:

### Bab III - Perancangan Sistem
- **3.1 Analisis Kebutuhan Data**
  - Identifikasi data dari Buku Induk
  - Penentuan field wajib dan opsional
  - Prioritas data untuk OCR

- **3.2 Perancangan Database**
  - ERD (Entity Relationship Diagram)
  - Normalisasi database (3NF)
  - Definisi constraints dan indexes

- **3.3 Perancangan Arsitektur Data**
  - Data flow dari scan → OCR → database
  - Strategi penyimpanan file
  - Backup dan recovery plan

### Bab IV - Implementasi
- **4.1 Implementasi Database**
  - SQL schema creation
  - Sample data insertion
  - Stored procedures untuk pencarian

- **4.2 Implementasi OCR**
  - Field extraction dari dokumen
  - Mapping OCR result ke database fields
  - Validation dan error handling

- **4.3 Implementasi Pencarian**
  - Fuzzy search algorithm
  - Query optimization
  - Indexing strategy

---

## 📚 Referensi

1. Peraturan Menteri Pendidikan tentang Buku Induk Siswa
2. Standar Pengelolaan Arsip Sekolah
3. Best Practices Database Design
4. OCR Accuracy Standards
5. Fuzzy String Matching Algorithms

---

**Versi:** 1.0  
**Tanggal:** 2026-01-17  
**Penulis:** Tim Pengembang Alumni Smart Archive  
**Status:** Final untuk Penelitian Skripsi
