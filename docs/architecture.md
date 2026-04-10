# Arsitektur Sistem Alumni Smart Archive

## 1. Tinjauan Umum
Sistem *Alumni Smart Archive* dirancang menggunakan arsitektur *Microservices* yang dimodifikasi (Hybrid with Monolith elements), memisahkan antarmuka pengguna, logika bisnis utama, dan layanan kecerdasan buatan (AI) untuk memastikan skalabilitas dan kemudahan pemeliharaan.

## 2. Diagram Arsitektur (High-Level)

```mermaid
graph TD
    User[Staf Tata Usaha] -->|HTTPS| Frontend[Frontend PWA (Next.js)]
    
    subgraph Client Side
        Frontend
        Camera[Kamera Perangkat]
    end

    Frontend -->|REST API| Backend[Backend API (ASP.NET Core)]
    Frontend -->|Capture| Camera
    
    subgraph Server Side
        Backend -->|Query/Auth| Database[(MySQL Database)]
        Backend -->|File Processing| Storage[Local Storage / Uploads]
        
        Backend -->|HTTP POST Image| AI_Service[AI Service (Python/FastAPI)]
    end
    
    subgraph AI Processing
        AI_Service -->|Image| Preprocessing[Preprocessing (OpenCV)]
        Preprocessing -->|Clean Image| OCR[OCR Engine (Tesseract)]
        AI_Service -->|Text Query| Fuzzy[Fuzzy Matcher (RapidFuzz)]
        
        OCR -->|Extracted Text| AI_Service
        Fuzzy -->|Similarity Score| AI_Service
    end
```

## 3. Komponen Utama

### A. Frontend (Presentation Layer)
- **Teknologi**: Next.js 15 (React Framework), Tailwind CSS (via variables).
- **Peran**: Menyediakan antarmuka interaktif bagi pengguna. Menangani input kamera, upload file, dan visualisasi data. Mengimplementasikan konsep PWA (*Progressive Web App*) untuk aksesibilitas *offline-first*.

### B. Backend (Business Logic Layer)
- **Teknologi**: ASP.NET Core Web API (.NET 9).
- **Peran**: Pusat orkestrasi sistem. Mengelola otentikasi, otorisasi, validasi data, dan komunikasi dengan layanan lain (Database & AI Service).
- **Pola Desain**: Repository Pattern, Dependency Injection.

### C. AI Service (Intelligence Layer)
- **Teknologi**: Python (FastAPI), OpenCV, Tesseract OCR, RapidFuzz.
- **Peran**: Menangani tugas-tugas komputasi berat dan cerdas.
    1. **Preprocessing**: Meningkatkan kualitas citra (binarisasi, *noise reduction*) sebelum diproses.
    2. **OCR**: Mengubah citra dokumen menjadi teks digital yang dapat dicari.
    3. **Fuzzy Matching**: Menghitung jarak kemiripan (*Levenshtein Distance*) antar string untuk pencarian yang toleran kesalahan.

### D. Database (Data Persistence Layer)
- **Teknologi**: MySQL.
- **Peran**: Menyimpan data relasional terstruktur: data alumni, metadata arsip, hasil OCR, dan log aktivitas pencarian.

## 4. Alur Komunikasi Data
1. **Unggah Arsip**: Frontend mengirim file -> Backend menyimpan file -> Backend mengirim stream ke AI Service -> AI Service mengembalikan teks -> Backend menyimpan metadata & teks ke Database.
2. **Pencarian**: Frontend mengirim *keyword* -> Backend mengambil kandidat dari Database -> Backend mengirim kandidat & *keyword* ke AI Service -> AI Service menghitung skor kemiripan -> Backend mengurutkan & mengembalikan hasil.
