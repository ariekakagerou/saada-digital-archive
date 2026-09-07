@echo off
:: =========================================================================
:: SAADA - Launcher PM2
:: =========================================================================
title Launcher PM2 - SAADA Production
cd /d "%~dp0"

echo =========================================================
echo    LAUNCHER DAN MONITOR PM2 SATU-KLIK - SAADA
echo    Sistem Arsip Alumni ASSA'ADAH
echo =========================================================
echo.

:: 1. Periksa PM2
echo [1/4] Memeriksa instalasi PM2...
where pm2 >nul 2>&1
if %errorlevel% neq 0 (
    echo PM2 belum terpasang. Memasang PM2 secara global...
    call npm install -g pm2
) else (
    echo PM2 sudah terpasang.
)

:: 2. Membangun file produksi jika belum ada
echo.
echo [2/4] Memeriksa berkas kompilasi produksi...

if exist "backend\publish\AlumniSmartArchive.Backend.dll" goto SKIP_BUILD_BACKEND
echo Berkas build Backend tidak ditemukan. Membangun Backend (.NET Publish)...
cd backend
call dotnet publish -c Release -o ./publish
cd ..
echo Build Backend selesai.
:SKIP_BUILD_BACKEND
echo Berkas build Backend sudah siap.

if exist "frontend\.next" goto SKIP_BUILD_FRONTEND
echo Berkas build Next.js tidak ditemukan. Membangun Frontend (Next.js Build)...
cd frontend
call npm run build
cd ..
echo Build Frontend selesai.
:SKIP_BUILD_FRONTEND
echo Berkas build Frontend sudah siap.

:: 3. Memeriksa dependensi Python AI Service
echo.
echo [3/4] Memeriksa dependensi AI-Service (Python)...
cd ai-service
call pip install -r requirements.txt --quiet
cd ..
echo Dependensi Python aman.

:: 4. Jalankan PM2
echo.
echo [4/4] Menjalankan orkestrasi server dengan PM2...
call npx pm2 start ecosystem.config.js

echo.
echo =========================================================
echo SEMUA SERVICE TELAH BERJALAN DI LATAR BELAKANG!
echo =========================================================
echo  * Frontend   : http://localhost:3000
echo  * Backend API: http://localhost:5084
echo  * AI OCR     : http://localhost:5000
echo =========================================================
echo TIPS PERINTAH PM2 UTAMA (Buka di CMD baru):
echo  - npx pm2 status       : Melihat daftar service yang aktif
echo  - npx pm2 logs         : Melihat catatan log semua server
echo  - npx pm2 stop all     : Menghentikan sementara semua server
echo  - npx pm2 delete all   : Menghapus server dari daftar monitor PM2
echo =========================================================
echo.
echo Tekan tombol apa saja untuk membuka DASHBOARD MONITORING...
pause

call npx pm2 monit
