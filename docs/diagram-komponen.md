# Diagram Komponen (Component Diagram)
## Sistem Alumni Smart Archive

Diagram Komponen menggambarkan struktur fisik dan hubungan ketergantungan (dependencies) antara modul-modul perangkat lunak di dalam sistem *Alumni Smart Archive*. Hubungan ini dipetakan berdasarkan struktur arsitektur sistem nyata (Next.js, ASP.NET Core, FastAPI, dan MySQL).

---

## 📊 Visualisasi Diagram Komponen (Mermaid)

```mermaid
graph TB
    %% ==========================================
    %% STYLE DEFINITIONS
    %% ==========================================
    classDef layerStyle fill:#F7FAFC,stroke:#A0AEC0,stroke-width:2px,stroke-dasharray: 5 5;
    classDef compStyle fill:#EBF8FF,stroke:#3182CE,stroke-width:2px,rx:6px,ry:6px;
    classDef interfaceStyle fill:#E6FFFA,stroke:#319795,stroke-width:1.5px;
    classDef dbStyle fill:#EDFDFD,stroke:#234E52,stroke-width:2.5px;

    %% ==========================================
    %% PRESENTATION LAYER (FRONTEND)
    %% ==========================================
    subgraph Layer_Presentation ["1. Presentation Layer (Frontend PWA)"]
        direction TB
        FrontendApp["«component»<br/><b>saada-frontend (Next.js)</b>"]:::compStyle
        CamController["«component»<br/><b>Camera Controller</b><br/>(Web Device API)"]:::compStyle
        PwaEngine["«component»<br/><b>PWA Service Worker</b><br/>(Offline & Caching)"]:::compStyle
        ApiClient["«component»<br/><b>API Service Client</b><br/>(Fetch / DTO Router)"]:::compStyle

        FrontendApp --> CamController
        FrontendApp --> PwaEngine
        FrontendApp --> ApiClient
    end
    style Layer_Presentation fill:#EDF2F7,stroke:#CBD5E0,stroke-width:1px

    %% ==========================================
    %% BUSINESS LOGIC LAYER (BACKEND)
    %% ==========================================
    subgraph Layer_Business ["2. Business Logic Layer (Backend API)"]
        direction TB
        BackendAPI["«component»<br/><b>saada-backend (ASP.NET Core)</b>"]:::compStyle
        Controllers["«component»<br/><b>API Controllers</b><br/>(Alumni / Archives / Auth / Users)"]:::compStyle
        Services["«component»<br/><b>Business Services</b><br/>(Token / File Management)"]:::compStyle
        AiClient["«component»<br/><b>AI Service Client</b><br/>(HttpClient Proxy)"]:::compStyle
        DbContext["«component»<br/><b>EF Core DbContext</b><br/>(Data Mapper)"]:::compStyle

        BackendAPI --> Controllers
        Controllers --> Services
        Controllers --> AiClient
        Controllers --> DbContext
    end
    style Layer_Business fill:#EDF2F7,stroke:#CBD5E0,stroke-width:1px

    %% ==========================================
    %% INTELLIGENCE LAYER (AI SERVICE)
    %% ==========================================
    subgraph Layer_AI ["3. Intelligence Layer (AI Service)"]
        direction TB
        FastApiApp["«component»<br/><b>saada-ai-service (FastAPI)</b>"]:::compStyle
        Preprocessor["«component»<br/><b>Image Preprocessor</b><br/>(OpenCV Logic)"]:::compStyle
        OcrEngine["«component»<br/><b>OCR Engine Wrapper</b><br/>(Tesseract API)"]:::compStyle
        FuzzyMatcher["«component»<br/><b>Fuzzy Matcher</b><br/>(RapidFuzz Score)"]:::compStyle

        FastApiApp --> Preprocessor
        FastApiApp --> FuzzyMatcher
        Preprocessor --> OcrEngine
    end
    style Layer_AI fill:#EDF2F7,stroke:#CBD5E0,stroke-width:1px

    %% ==========================================
    %% PERSISTENCE LAYER (DATABASE & STORAGE)
    %% ==========================================
    subgraph Layer_Persistence ["4. Persistence Layer"]
        direction LR
        DatabaseServer[("«database»<br/><b>MySQL Server</b><br/>(alumni_archive_db)")]:::dbStyle
        UploadsFolder["«file system»<br/><b>Local Folder</b><br/>(/uploads/archives)"]:::dbStyle
    end
    style Layer_Persistence fill:#E2E8F0,stroke:#A0AEC0,stroke-width:1px

    %% ==========================================
    %% INTER-COMPONENT DEPENDENCIES
    %% ==========================================
    ApiClient -->|HTTPS REST API / JSON<br/>(Port: 5084) | Controllers
    AiClient -->|HTTP Request / JSON<br/>(Port: 5000 / 8000) | FastApiApp
    DbContext -->|SQL Connection / TCP<br/>(Port: 3306) | DatabaseServer
    Services -->|IO Write / Local Disk| UploadsFolder

```

---

## 📝 Penjelasan Detail Komponen

### 1. Presentation Layer (Frontend PWA)
Lapisan terluar yang berinteraksi langsung dengan pengguna (Staf Tata Usaha).
*   **saada-frontend (Next.js)**: Kerangka utama frontend menggunakan Next.js 15 yang bertugas merender halaman Dashboard, Pencarian Alumni, dan Manajemen Berkas secara responsif.
*   **Camera Controller**: Komponen yang memanfaatkan Web API browser (`navigator.mediaDevices.getUserMedia`) untuk mengoperasikan kamera perangkat (HP atau Laptop) guna memotret berkas ijazah fisik.
*   **PWA Service Worker**: Komponen untuk mendukung fungsionalitas *Progressive Web App*, seperti kemampuan berjalan secara *offline*, manajemen *caching* aset statis, dan instalasi aplikasi ke desktop/HP.
*   **API Service Client**: Modul khusus untuk mengirimkan HTTP request ke Backend API dan memetakan struktur data (*Data Transfer Object* / DTO).

### 2. Business Logic Layer (Backend API)
Lapisan inti pengendali alur bisnis aplikasi.
*   **saada-backend (ASP.NET Core)**: Web API utama berbasis .NET 9 yang menangani otentikasi, otorisasi, keamanan data, dan koordinasi antar service.
*   **API Controllers**: Modul pengekspos endpoint REST API.
    *   `AuthController`: Menangani Login Staff, token JWT, dan Google Sign-In.
    *   `ArchivesController`: Menangani unggah berkas, memicu alur kerja OCR, serta mengambil detail arsip.
    *   `AlumniController`: Mengelola operasi CRUD data alumni dan pencarian.
*   **Business Services**: Mengelola logika sekunder seperti pembuatan token JWT, validasi file, dan enkripsi data sensitif.
*   **AI Service Client**: HTTP Client proxy khusus untuk meneruskan gambar arsip ke AI Service serta mengambil hasil fuzzy search.
*   **EF Core DbContext**: Penghubung (ORM) antara model data di C# dengan tabel di MySQL Server.

### 3. Intelligence Layer (AI Service)
Lapisan pengolah citra dan algoritma kecerdasan buatan.
*   **saada-ai-service (FastAPI)**: Web API ringan berbasis Python untuk menampung fungsi pengolahan data berat.
*   **Image Preprocessor**: Mengolah gambar mentah menggunakan OpenCV (misalnya: mengubah ke skala abu-abu, membersihkan bintik noise, meluruskan rotasi berkas, dan binarisasi *Adaptive Thresholding*).
*   **OCR Engine Wrapper**: Melakukan jembatan instruksi dengan engine *Tesseract OCR v5* untuk membaca teks dari gambar yang sudah bersih.
*   **Fuzzy Matcher**: Melakukan komputasi kemiripan string menggunakan algoritma Levenshtein Distance dari library *RapidFuzz* untuk mencari data alumni yang toleran terhadap salah ketik (*typo*).

### 4. Persistence Layer
Lapisan penyimpanan data permanen.
*   **MySQL Server**: Menyimpan data terstruktur (tabel alumni, data orang tua, riwayat akademik, log audit, riwayat perubahan, dan kredensial user).
*   **Local Folder (/uploads/archives)**: Direktori penyimpanan fisik untuk berkas-berkas digital (PDF/Citra Ijazah asli) yang telah diunggah.
