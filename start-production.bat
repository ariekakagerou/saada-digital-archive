@echo off
:: =========================================================================
:: 🎓 SAADA - Launcher Produksi Satu-Klik
:: =========================================================================
title Menyalakan SAADA Production...
cd /d "%~dp0"

echo =========================================================
echo    🎓 LAUNCHER PRODUKSI SATU-KLIK SAADA 🎓
echo    Sistem Arsip Alumni ASSA'ADAH
echo =========================================================
echo.
echo Membuka server dalam mode produksi... Harap tunggu...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File .\start-production.ps1

exit
