@echo off
title SAADA - Stop PM2 Server
cd /d "%~dp0"

echo =========================================================
echo    MEMATIKAN SEMUA SERVICE PM2 - SAADA
echo =========================================================
echo.

call npx pm2 delete all
call npx pm2 kill

echo.
echo =========================================================
echo SEMUA SERVICE TELAH BERHASIL DIMATIKAN!
echo =========================================================
echo.
pause
