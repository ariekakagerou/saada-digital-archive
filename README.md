# 🎓 Alumni Smart Archive

[![Status](https://img.shields.io/badge/Status-Development-orange.svg)]()
[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20|%20.NET%20|%20Python-blue.svg)]()

**Alumni Smart Archive** adalah sistem manajemen arsip digital alumni yang cerdas, menggabungkan kekuatan **Modern Web UI**, **Robust Backend API**, dan **AI-powered OCR** untuk digitalisasi dokumen alumni yang efisien.

---

## 🏗️ System Architecture

Proyek ini menggunakan arsitektur micro-services sederhana yang terdiri dari tiga komponen utama:

1.  **Frontend**: Aplikasi web berbasis Next.js 14+ dengan desain modern "Neon Glassmorphism".
2.  **Backend**: RESTful API yang dibangun dengan .NET Core 8 untuk manajemen data dan logika bisnis.
3.  **AI Service**: Service berbasis Python (FastAPI/Flask) yang menangani OCR (Optical Character Recognition), Image Enhancement, dan Fuzzy Matching.

---

## ✨ Key Features

-   🔍 **Smart OCR Extraction**: Ekstraksi teks otomatis dari dokumen alumni (ijazah, sertifikat, dll) menggunakan Tesseract OCR.
-   🪄 **Image Enhancement**: Preprocessing gambar otomatis (Deskew, Denoise, sharpening) untuk meningkatkan akurasi pembacaan.
-   🧬 **Fuzzy Search**: Pencarian data alumni dengan toleransi kesalahan pengetikan (typo) menggunakan Levenshtein Distance.
-   📂 **Archive Management**: Manajemen data alumni yang komprehensif mulai dari data diri hingga riwayat akademik.
-   🎨 **Modern Dynamic UI**: Interface yang responsif, interaktif, dan premium dengan tema gelap (Dark Mode).

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Framer Motion (Glassmorphism Aesthetic)
- **Icons**: Lucide React

### Backend
- **Framework**: [.NET Core 8 Web API](https://dotnet.microsoft.com/en-us/apps/aspnet/apis)
- **Language**: C#
- **Patterns**: Repository & Service Pattern
- **Database**: PostgreSQL / SQL Server (via Entity Framework Core)

### AI Service
- **Framework**: Python (FastAPI/Flask)
- **OCR Engine**: [Tesseract OCR](https://github.com/tesseract-ocr/tesseract)
- **Computer Vision**: OpenCV, NumPy
- **String Matching**: RapidFuzz (Levenshtein Distance)

---

## 🚀 Getting Started

### Prerequisites

Pastikan Anda telah menginstal komponen berikut:
- [Node.js (v18+)](https://nodejs.org/)
- [.NET SDK (v8.0+)](https://dotnet.microsoft.com/download)
- [Python (v3.9+)](https://www.python.org/)
- [Tesseract OCR Engine](https://github.com/UB-Mannheim/tesseract/wiki)

### Installation & Run

#### Option 1: Quick Start (Windows Only)
Jalankan script PowerShell di root directory untuk menjalankan semua service sekaligus:

```powershell
./start-all.ps1
```

#### Option 2: Manual Start

**1. AI Service (Port 5000)**
```bash
cd ai-service
pip install -r requirements.txt
python app.py
```

**2. Backend API (Port 5084)**
```bash
cd backend
dotnet run
```

**3. Frontend (Port 3000)**
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```text
alumni-smart-archive/
├── ai-service/          # Python AI & OCR Service
│   ├── ocr/             # OCR Engine & Preprocessing
│   └── fuzzy/           # Fuzzy Matching Logic
├── backend/             # .NET Core Web API
│   ├── Controllers/     # API Endpoints
│   ├── Models/          # Database Entities
│   └── Services/        # Business Logic
├── frontend/            # Next.js Web Application
│   ├── src/app/         # Routing & Pages
│   └── components/      # UI Components
├── docs/                # Project Documentation
└── start-all.ps1        # Orchestration script
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ by the Alumni Smart Archive Team**
