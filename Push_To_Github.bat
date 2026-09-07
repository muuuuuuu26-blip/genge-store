@echo off
set "GIT_CMD="

if exist "C:\Program Files\Git\cmd\git.exe" set "GIT_CMD=C:\Program Files\Git\cmd\git.exe"
if exist "C:\Program Files (x86)\Git\cmd\git.exe" set "GIT_CMD=C:\Program Files (x86)\Git\cmd\git.exe"
if exist "%LOCALAPPDATA%\Programs\Git\cmd\git.exe" set "GIT_CMD=%LOCALAPPDATA%\Programs\Git\cmd\git.exe"

if not defined GIT_CMD (
    for /d %%D in ("%LOCALAPPDATA%\GitHubDesktop\app-*") do (
        if exist "%%D\resources\app\git\cmd\git.exe" set "GIT_CMD=%%D\resources\app\git\cmd\git.exe"
        if exist "%%D\resources\app\git\bin\git.exe" set "GIT_CMD=%%D\resources\app\git\bin\git.exe"
    )
)

if not defined GIT_CMD (
    where git >nul 2>&1
    if not errorlevel 1 set "GIT_CMD=git"
)

if not defined GIT_CMD (
    echo.
    echo [TAARIFA] Git haijapatikana kwenye Njia za kawaida.
    echo.
    pause
    exit /b 1
)

echo [GIT FOUND]: "%GIT_CMD%"
echo.
echo Inatuma mabadiliko kwenye GitHub...
echo.

"%GIT_CMD%" add .
"%GIT_CMD%" commit -m "Boresha upande wa Admin: Calculator ya Vifurushi, Punguzo la Mteja, na Usimamizi wa Bei"
"%GIT_CMD%" push origin main

echo.
echo ==============================================
echo ✅ Kazi imekamilika! Mabadiliko yameshatumwa GitHub.
echo ==============================================
pause
