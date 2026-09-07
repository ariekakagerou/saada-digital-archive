# =========================================================================
# 🎓 SAADA - Sistem Arsip Alumni ASSA'ADAH
# Script Orkestrasi Produksi & Build Otomatis (Windows Only)
# =========================================================================

Clear-Host
$host.UI.RawUI.WindowTitle = "SAADA Production Server"

Write-Host "=========================================================" -ForegroundColor Green
Write-Host "     🎓 SAADA (Sistem Arsip Alumni ASSA'ADAH) 🎓" -ForegroundColor Green
Write-Host "           PORTAL PRODUKSI DAN BUILD OTOMATIS" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green
Write-Host ""

# ── 1. VERIFIKASI KONEKSI DATABASE (MySQL) ──
Write-Host "[1/4] Memeriksa koneksi database MySQL (Port 3306)..." -ForegroundColor Cyan
$mysqlPort = 3306
$tcpClient = New-Object System.Net.Sockets.TcpClient
$isConnected = $false

try {
    $asyncResult = $tcpClient.BeginConnect("127.0.0.1", $mysqlPort, $null, $null)
    $success = $asyncResult.AsyncWaitHandle.WaitOne(1500, $false)
    if ($success) {
        $tcpClient.EndConnect($asyncResult)
        $isConnected = $true
    }
} catch {
    $isConnected = $false
} finally {
    $tcpClient.Close()
}

if (-not $isConnected) {
    Write-Host ""
    Write-Host "⚠️ [PERINGATAN] Port 3306 (MySQL) tidak merespon!" -ForegroundColor Yellow
    Write-Host "Harap pastikan XAMPP / Laragon MySQL Anda sudah AKTIF sebelum menjalankan aplikasi." -ForegroundColor Yellow
    Write-Host "Sistem akan tetap melanjutkan proses startup..." -ForegroundColor DarkYellow
    Write-Host ""
    Start-Sleep -Seconds 3
} else {
    Write-Host "✔️ Koneksi MySQL berhasil dideteksi!" -ForegroundColor Green
}

# ── 2. DETEKSI & BUILD BACKEND API (.NET Core 9) ──
Write-Host ""
Write-Host "[2/4] Memeriksa status build Backend (.NET API)..." -ForegroundColor Cyan
$backendPublishDir = "backend\publish"
$backendDll = "$backendPublishDir\AlumniSmartArchive.Backend.dll"

if (-not (Test-Path $backendDll)) {
    Write-Host "⚠️ Hasil build produksi Backend tidak ditemukan. Memulai kompilasi (.NET Publish)..." -ForegroundColor Yellow
    Push-Location backend
    dotnet publish -c Release -o ./publish
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Eror saat membuild Backend API! Harap periksa kode C# Anda." -ForegroundColor Red
        Pop-Location
        Exit 1
    }
    Pop-Location
    Write-Host "✔️ Backend API berhasil dikompilasi untuk produksi!" -ForegroundColor Green
} else {
    Write-Host "✔️ Hasil build produksi Backend ditemukan. Siap dijalankan!" -ForegroundColor Green
}

# ── 3. DETEKSI & BUILD FRONTEND (Next.js) ──
Write-Host ""
Write-Host "[3/4] Memeriksa status build Frontend (Next.js)..." -ForegroundColor Cyan
$frontendBuildDir = "frontend\.next"

if (-not (Test-Path $frontendBuildDir)) {
    Write-Host "⚠️ Hasil build Next.js tidak ditemukan. Memulai build produksi (Next.js Build)..." -ForegroundColor Yellow
    Write-Host "Proses ini membutuhkan waktu beberapa menit. Harap tunggu..." -ForegroundColor DarkYellow
    Push-Location frontend
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Eror saat membuild Frontend Next.js!" -ForegroundColor Red
        Pop-Location
        Exit 1
    }
    Pop-Location
    Write-Host "✔️ Frontend Next.js berhasil di-build untuk produksi!" -ForegroundColor Green
} else {
    Write-Host "✔️ Hasil build Frontend Next.js ditemukan. Siap dijalankan!" -ForegroundColor Green
}

# ── 4. DETEKSI & INSTALASI DEPENDENSI AI SERVICE (Python) ──
Write-Host ""
Write-Host "[4/4] Memeriksa dependensi AI-Service (Python)..." -ForegroundColor Cyan
Push-Location ai-service
Write-Host "Memasang dependensi dari requirements.txt..." -ForegroundColor DarkYellow
pip install -r requirements.txt --quiet
pip install uvicorn --quiet
Pop-Location
Write-Host "✔️ AI Service Python siap!" -ForegroundColor Green

# ── 5. ORKESTRASI PENYALAAN SELURUH SERVICE (PRODUCTION MODE) ──
Write-Host ""
Write-Host "=========================================================" -ForegroundColor Green
Write-Host "🚀 SEMUA SERVICE SIAP! MENYALAKAN SISTEM DALAM MODE PRODUKSI..." -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green
Start-Sleep -Seconds 2

# A. Jalankan Python AI Service (Port 5000)
Write-Host "🔥 Menyalakan AI OCR Service pada Port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ai-service; $host.UI.RawUI.WindowTitle='🔥 SAADA AI Service (Port 5000)'; python app.py"

# B. Jalankan Backend API (.NET Production on Port 5084)
Write-Host "⚡ Menyalakan Backend API pada Port 5084..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; $host.UI.RawUI.WindowTitle='⚡ SAADA Backend API (Port 5084)'; dotnet .\publish\AlumniSmartArchive.Backend.dll"

# C. Jalankan Frontend (Next.js Production Server on Port 3000)
Write-Host "🎨 Menyalakan Frontend Next.js pada Port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; $host.UI.RawUI.WindowTitle='🎨 SAADA Frontend Server (Port 3000)'; npm run start"

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Green
Write-Host "🎉 SISTEM BERHASIL DIJALANKAN!" -ForegroundColor Green
Write-Host "Aplikasi dapat diakses di: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Untuk mematikan sistem, silakan tutup ketiga jendela terminal baru yang terbuka." -ForegroundColor LightGray
Write-Host "=========================================================" -ForegroundColor Green
