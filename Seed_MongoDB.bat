@echo off
title GENGE - Weka Bidhaa kwenye Database
color 0B

echo ============================================
echo   GENGE - Weka Bidhaa kwenye MongoDB Atlas
echo ============================================
echo.

:: Nenda kwenye folda ya mradi
cd /d "%~dp0"

:: Tafuta node.exe mahali popote
set NODE_EXE=
for %%p in (
    "C:\Program Files\nodejs\node.exe"
    "C:\Program Files (x86)\nodejs\node.exe"
    "%APPDATA%\nvm\current\node.exe"
    "%LOCALAPPDATA%\Programs\nodejs\node.exe"
) do (
    if exist %%p (
        set NODE_EXE=%%p
        goto :found
    )
)

:: Jaribu kutumia 'node' moja kwa moja
where node >nul 2>&1
if %errorlevel% == 0 (
    set NODE_EXE=node
    goto :found
)

echo ❌ KOSA: Node.js haijapatikana kwenye kompyuta yako!
echo.
echo Tafadhali pakua Node.js kutoka: https://nodejs.org
echo Kisha jaribu tena.
pause
exit /b 1

:found
echo ✅ Node.js imepatikana: %NODE_EXE%
echo.

echo [HATUA 1/2] Inaweka bidhaa kwenye database...
echo Subiri sekunde chache...
echo.
%NODE_EXE% seed.js
if %errorlevel% neq 0 (
    echo.
    echo ❌ KOSA kwenye seed.js! Angalia ujumbe hapo juu.
    pause
    exit /b 1
)

echo.
echo ✅ Bidhaa zimewekwa kikamilifu!
echo.
echo ============================================
echo [HATUA 2/2] Inapakia picha kwenda Cloudinary...
echo Hii inaweza kuchukua dakika 2-5. Subiri...
echo ============================================
echo.
%NODE_EXE% migrate_images.js

echo.
echo ============================================
echo   ✅ IMEKAMILIKA! Sasa fungua tovuti yako:
echo   https://genge-online-shop.onrender.com
echo ============================================
echo.
pause
