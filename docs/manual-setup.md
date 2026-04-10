# Panduan Penggunaan Sistem (User Manual)

Dokumen ini berisi panduan langkah demi langkah untuk menjalankan dan menggunakan prototipe sistem *Alumni Smart Archive*.

## Persyaratan Sistem (Prerequisites)
Sebelum menjalankan sistem, pastikan perangkat komputer memiliki:
- **Node.js** (v18 ke atas) - Untuk menjalankan Frontend.
- **.NET SDK** (v9.0) - Untuk menjalankan Backend.
- **Python** (v3.10 ke atas) - Untuk menjalankan AI Service.
- **MySQL Server** (XAMPP/WAMP) - Database utama.

## Cara Menjalankan Sistem (Localhost)

Sistem terdiri dari 3 layanan terpisah yang harus dijalankan secara bersamaan. Buka 3 terminal berbeda untuk masing-masing layanan.

### 1. Menjalankan Database
- Nyalakan modul **Apache** dan **MySQL** pada panel kontrol XAMPP.
- Buat database kosong bernama `alumni_archive_db` (atau biarkan Backend membuatnya otomatis).

### 2. Menjalankan AI Service (Port 5000)
```bash
cd ai-service
pip install -r requirements.txt
python app.py
```
*Tunggu hingga muncul pesan: `Uvicorn running on http://0.0.0.0:5000`*

### 3. Menjalankan Backend API (Port 5xxx)
```bash
cd backend
dotnet restore
dotnet run
```
*Tunggu hingga muncul pesan: `Now listening on: http://localhost:5xxx`*

### 4. Menjalankan Frontend PWA (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
*Buka browser dan akses: `http://localhost:3000`*

---

## Panduan Fitur Utama

### A. Login Staff
1. Buka halaman utama.
2. Klik tombol "Login Petugas".
3. Masukkan username: `admin` dan password: `admin123`.

### B. Memindai Arsip (Kamera)
1. Pilih menu **"Unggah Arsip"** di sidebar kiri.
2. Klik tombol **"Scan dengan Kamera"**.
3. Izinkan akses kamera pada *pop-up* browser.
4. Arahkan dokumen ke dalam kotak panduan.
5. Klik tombol **Kamera** (lingkaran hijau).
6. Periksa hasil foto, lalu klik **"Gunakan Gambar"**.
7. Sistem akan mengekstraksi teks secara otomatis.

### C. Pencarian Cerdas (Fuzzy Search)
1. Pilih menu **"Pencarian"**.
2. Ketik nama alumni (boleh ada kesalahan ketik, misal: "Hasym").
3. Sistem akan menampilkan daftar nama yang paling mirip beserta skor kemiripannya (misal: "Hasyim Asyari - 95%").
