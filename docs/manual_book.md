# Manual Book: Alumni Smart Archive
**Sistem Digitalisasi Arsip Alumni Berbasis OCR & Fuzzy String Matching**

---

## 1. Pendahuluan
Alumni Smart Archive adalah sistem yang dirancang untuk mendigitalkan dokumen fisik alumni menggunakan teknologi *Optical Character Recognition* (OCR) untuk ekstraksi teks dan *Fuzzy String Matching* untuk pencarian data yang toleran terhadap kesalahan pengetikan atau hasil pembacaan OCR yang kurang sempurna.

### Fitur Utama:
*   **PWA Ready:** Dapat diinstal di HP/Desktop dan diakses secara offline (dasar).
*   **OCR Intelligent:** Ekstraksi data otomatis dari foto/upload dokumen.
*   **Image Enhancement:** Perbaikan kualitas gambar otomatis (Deskew, Contrast, Denoise).
*   **Fuzzy Search:** Pencarian nama alumni yang cerdas menggunakan algoritma *Levenshtein Distance*.
*   **Dashboard Statistik:** Visualisasi jumlah arsip yang telah didigitalkan.

---

## 2. Persyaratan Sistem (Prerequisites)
Sebelum menjalankan aplikasi, pastikan perangkat Anda telah terinstall:
1.  **Node.js v20+** (Untuk Frontend Next.js)
2.  **.NET 9 SDK** (Untuk Backend ASP.NET Core)
3.  **Python 3.10+** (Untuk AI Service)
4.  **MySQL Server** (Database)
5.  **Tesseract OCR Engine:**
    *   **Windows:** Unduh installer `.exe` dari [UB Mannheim](https://github.com/UB-Mannheim/tesseract/wiki).
    *   **Linux:** `sudo apt install tesseract-ocr`.
    *   *PENTING:* Tambahkan path instalasi Tesseract ke Environment Variables System.

---

## 3. Instalasi & Konfigurasi

### A. Konfigurasi Database (MySQL)
1.  Buat database baru bernama `alumni_archive_db`.
2.  Sesuaikan string koneksi di `backend/appsettings.json`:
    ```json
    "ConnectionStrings": {
      "DefaultConnection": "server=localhost;user=root;password=PASSWORD_ANDA;database=alumni_archive_db"
    }
    ```

### B. Instalasi Backend (.NET)
```bash
cd backend
dotnet restore
```

### C. Instalasi AI Service (Python)
```bash
cd ai-service
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### D. Instalasi Frontend (Next.js)
```bash
cd frontend
npm install
```

---

## 4. Cara Menjalankan Aplikasi

Pastikan ketiga layanan berjalan secara bersamaan:

1.  **AI Service (Port 5000):**
    ```bash
    cd ai-service
    python app.py
    ```
2.  **Backend API (Port 5000/5001/Random):**
    ```bash
    cd backend
    dotnet run
    ```
    *(Catatan: Pastikan endpoint URL di frontend sesuai dengan port backend)*.
3.  **Frontend (Port 3000):**
    ```bash
    cd frontend
    npm run dev
    ```
    Akses aplikasi di `http://localhost:3000`.

---

## 5. Panduan Penggunaan (User Guide)

### A. Proses Digitalisasi (Upload/Scan)
1.  Buka menu **"Scan Arsip"** atau **"Upload"**.
2.  Ambil foto dokumen menggunakan kamera perangkat atau pilih file dari galeri.
3.  Tunggu sistem AI memproses gambar (Preprocessing -> OCR Extraction).
4.  Hasil ekstraksi akan muncul di form. Periksa kembali kebenaran data (Nama, NIM, Tahun Lulus).
5.  Klik **"Simpan ke Arsip"**.

### B. Pencarian Alumni
1.  Buka menu **"Data Alumni"** atau **"Cari"**.
2.  Ketik nama alumni pada kolom pencarian.
3.  Sistem akan menampilkan hasil meskipun ada kesalahan kecil pada ejaan (misal: Mengetik "Andi" akan memunculkan "Andy").

---

## 6. Penjelasan Algoritma (Technical Deep Dive)

### 1. Image Enhancement
Layanan AI menggunakan OpenCV untuk:
*   **Grayscale & Thresholding:** Mengubah gambar menjadi hitam-putih tegas untuk memudahkan OCR.
*   **CLAHE:** Meningkatkan kontras dokumen yang pudar.
*   **Deskewing:** Meluruskan posisi kertas dokumen yang miring saat difoto.

### 2. OCR (Tesseract)
Menggunakan mesin Tesseract untuk mengenali karakter (huruf/angka) dari koordinat pixel gambar.

### 3. Fuzzy String Matching
Menggunakan library **RapidFuzz** dengan metrik *Partial Ratio*. Algoritma ini membandingkan kedekatan dua teks berdasarkan jumlah perubahan (insert, delete, substitusi) yang diperlukan untuk menyamakan teks tersebut.

---

## 7. Troubleshooting (Tanya Jawab)

*   **T: OCR Tidak Muncul/Error?**
    *   J: Pastikan Tesseract sudah terinstall dan path-nya benar. Cek log di terminal `ai-service`.
*   **T: Gagal simpan ke database?**
    *   J: Cek status MySQL dan pastikan kredensial di `appsettings.json` sudah benar.
*   **T: Kamera tidak terbuka di HP?**
    *   J: Akses aplikasi harus menggunakan protokol **HTTPS** (atau `localhost` untuk pengembangan) agar browser mengizinkan akses kamera.

---
*Manual Book ini disusun oleh Antigravity AI - 2026*
