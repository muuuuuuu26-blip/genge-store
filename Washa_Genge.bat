@echo off
title GENGE ONLINE DELIVERY - Inawasha...
color 0A

echo ============================================
echo   GENGE ONLINE DELIVERY - Mfumo Unawasha...
echo ============================================
echo.

:: Nenda kwenye folda ya mradi
cd /d "%~dp0"

echo [1/2] Kuanza server...
start "GENGE Server" cmd /c "node server.js"

:: Subiri sekunde 3 ili server iwake kwanza
timeout /t 3 /nobreak >nul

echo [2/2] Kufungua duka kwenye browser...
start "" "http://localhost:3000"

echo.
echo ============================================
echo   Mfumo umewaka kikamilifu!
echo   Funga dirisha hili ili kuendelea.
echo ============================================
echo.
pause
