# 📖 Manual Book: Alumni Smart Archive
**Sistem Digitalisasi Arsip Alumni Berbasis OCR & Fuzzy String Matching**

---

## 📑 Daftar Isi
1. [Pendahuluan](#1-pendahuluan)
2. [Arsitektur Sistem](#2-arsitekur-sistem)
3. [Persyaratan Sistem (Prerequisites)](#3-persyaratan-sistem)
4. [Instalasi & Konfigurasi](#4-instalasi--konfigurasi)
5. [Pemodelan Data & Database](#5-pemodelan-data--database)
6. [Panduan Operasional (User Guide)](#6-panduan-operasional)
7. [Detail Teknis: OCR & Fuzzy Search](#7-detail-teknis-ocr--fuzzy-search)
8. [Troubleshooting & FAQ](#8-troubleshooting--faq)

---

## 1. Pendahuluan

### 1.1 Latar Belakang
Manajemen arsip alumni pada institusi pendidikan, khususnya tingkat Madrasah (MTs), seringkali masih mengandalkan Buku Induk fisik. Hal ini menimbulkan tantangan dalam hal kecepatan pencarian data, risiko kerusakan fisik dokumen, dan kesulitan dalam melakukan validasi identitas alumni. Proyek **Alumni Smart Archive** hadir untuk menjawab tantangan tersebut dengan mengintegrasikan teknologi *Optical Character Recognition* (OCR) dan pencarian cerdas berbasis *Fuzzy Matching*.

### 1.2 Tujuan Sistem
*   Mentransformasi arsip fisik alumni menjadi data digital yang terstruktur.
*   Meningkatkan akurasi ekstraksi data menggunakan algoritma cerdas.
*   Mempercepat proses temu kembali (*information retrieval*) data alumni.

### 1.3 Manfaat
*   **Efisiensi Waktu:** Memangkas waktu pencarian data alumni dari hitungan menit/jam menjadi hitungan detik.
*   **Integritas Data:** Mengurangi risiko kehilangan atau kerusakan data primer.
*   **Aksesibilitas:** Memungkinkan data diakses secara responsif melalui berbagai perangkat (Desktop/Mobile).

---

## 2. Arsitektur Sistem

### 2.1 Gambaran Umum
Sistem ini dirancang menggunakan pendekatan arsitektur **Hybrid Micro-Service** yang memisahkan beban kerja logika bisnis dengan beban kerja komputasi cerdas (AI). Pendekatan ini memastikan bahwa proses ekstraksi OCR yang berat tidak mengganggu performa manajemen data utama.

### 2.2 Komponen Utama
*   **Frontend (Next.js 15):** Berfungsi sebagai antarmuka pengguna (User Interface) yang menangani pengambilan gambar melalui kamera dan menampilkan hasil ekstraksi. Menggunakan teknologi PWA (*Progressive Web App*).
*   **Backend API (.NET Core 9):** Bertindak sebagai orkestrator yang mengelola validasi data, sistem keamanan, dan interaksi dengan database MySQL.
*   **AI Service (FastAPI):** Mesin kecerdasan buatan yang menangani pemrosesan citra tingkat lanjut menggunakan OpenCV, Tesseract OCR untuk ekstraksi teks, dan RapidFuzz untuk logika pencarian kemiripan.

### 2.3 Alur Komunikasi
Data mengalir dari **Frontend** (Capture) -> **Backend** (Proxy/Log) -> **AI Service** (Processing) -> **Backend** (Save) -> **Database**. Komunikasi antar layanan dilakukan menggunakan protokol REST API (HTTP) yang standar dan efisien.

---

## 3. Persyaratan Sistem
### 💻 Perangkat Keras (Minimal)
*   **Prosesor:** Intel Core i3 / AMD Ryzen 3 (Generasi 8+)
*   **RAM:** 8 GB
*   **Koneksi:** Lokal atau Internet (untuk PWA)

### 🛠️ Perangkat Lunak (Environment)
*   **Node.js:** v20 atau lebih baru.
*   **.NET SDK:** v9.0 (ASP.NET Core).
*   **Python:** v3.10+ (direkomendasikan v3.11).
*   **Database:** MySQL / MariaDB Server.
*   **OCR Engine:** Tesseract OCR (Versi 5.x).

---

## 4. Instalasi & Konfigurasi

### A. Tesseract OCR (Wajib)
1.  Unduh tesseract-ocr-w64-setup dari [UB Mannheim](https://github.com/UB-Mannheim/tesseract/wiki).
2.  Install ke direktori default: `C:\Program Files\Tesseract-OCR`.
3.  Pastikan binary `tesseract.exe` ada di path tersebut.

### B. Konfigurasi Database
1.  Buat database `alumni_archive_db` di MySQL.
2.  Import skema database (jika ada file `.sql`) atau biarkan Entity Framework melakukan migrasi.
3.  Sesuaikan kredensial di `backend/appsettings.json`.

### C. Menjalankan Layanan (Urutan yang direkomendasikan)

1.  **AI Service (Port 5000):**
    ```bash
    cd ai-service
    python -m venv venv
    .\venv\Scripts\activate  # Windows
    pip install -r requirements.txt
    python app.py
    ```

2.  **Backend API (Port 5084/7084):**
    ```bash
    cd backend
    dotnet restore
    dotnet run
    ```

3.  **Frontend (Port 3000):**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---

## 5. Pemodelan Data & Database
Sistem ini mengacu pada struktur **Buku Induk Siswa MTs** dengan prioritas ekstraksi pada:
*   **Identitas Pribadi:** Nama Lengkap (Fuzzy Primary), NIS, NISN, Tempat/Tgl Lahir.
*   **Data Kelulusan:** Tahun Lulus, Nomor Ijazah.

**Skema Relasi Utama:**
*   `Alumni` <--- (1) : (1) ---> `ParentData`
*   `Alumni` <--- (1) : (N) ---> `AcademicHistory`
*   `Alumni` <--- (1) : (N) ---> `ArchiveDocuments` (Menyimpan file & hasil OCR)

---

## 6. Panduan Operasional

### 🟢 Digitalisasi Dokumen
1.  Pilih menu **Scan/Upload**.
2.  Gunakan kamera (jika diakses via HP) untuk memotret dokumen atau upload file gambar.
3.  **Proses AI:** Sistem akan melakukan Deskew (meluruskan) dan Thresholding secara otomatis.
4.  **Validasi:** Cek hasil ekstraksi OCR di form yang muncul. Jika ada kesalahan pembacaan (terutama pada simbol aneh), Anda dapat mengeditnya secara manual sebelum disimpan.

### 🔍 Pencarian Pintar (Fuzzy Search)
1.  Gunakan kolom pencarian di halaman utama.
2.  Anda dapat mengetikkan nama meskipun tidak yakin dengan ejaan tepatnya.
3.  Sistem akan menampilkan skor kemiripan. Nilai di atas **60%** akan ditampilkan sebagai hasil yang relevan.

---

## 7. Detail Teknis: OCR & Fuzzy Search

### 🧬 Alur Pemrosesan Gambar (Pipeline)
1.  **Preprocessing:** Gambar diubah ke Grayscale -> Reduksi noise (Gaussian) -> Adaptive Thresholding.
2.  **Segmentation:** Menggunakan mode PSM 6 (Single uniform block of text).
3.  **Scoring:** Sistem menghitung *Confidence level* per karakter. Jika rata-rata di bawah 75%, sistem akan memberi peringatan kualitas gambar buruk.

### 📐 Algoritma Fuzzy String
Sistem menggunakan **Levenshtein Distance** (via RapidFuzz):
*   Menghitung jumlah operasi (tambah, hapus, ganti) karakter.
*   Rumus: `Score = (1 - (Edits / Max_Length)) * 100`.

---

## 8. Troubleshooting & FAQ

**❌ T: "TesseractNotFoundError: tesseract is not installed or it's not in your PATH"**
*   **J:** Buka `ai-service/ocr/extractor.py` dan pastikan path ke `tesseract.exe` sudah benar sesuai lokasi instalasi Anda.

**❌ T: Hasil OCR berantakan atau penuh simbol aneh.**
*   **J:** Hal ini biasanya disebabkan oleh kualitas foto yang buruk (gelap atau blur). Gunakan lampu kilat (flash) atau pastikan dokumen rata saat difoto. Gunakan endpoint `/ocr-enhanced` untuk hasil lebih maksimal.

**❌ T: Database tidak bisa terhubung.**
*   **J:** Pastikan service MySQL/XAMPP sudah aktif. Periksa port yang digunakan (default 3306).

---
*Manual Book ini diperbarui oleh Tim Pengembangan Alumni Smart Archive - April 2026*
