@echo off

echo.
echo ================================================
echo   Palestinian Domain Blocker - Firefox Install
echo ================================================
echo.

REM Check if we're in the right directory
if not exist "manifest.json" (
    echo Error: manifest.json not found!
    echo Please run this script from the extension directory.
    pause
    exit /b 1
)

echo [1/3] Checking Firefox installation...

REM Find Firefox executable
set "FIREFOX_PATH="
if exist "%ProgramFiles%\Mozilla Firefox\firefox.exe" (
    set "FIREFOX_PATH=%ProgramFiles%\Mozilla Firefox\firefox.exe"
    goto :firefox_found
)
if exist "%ProgramFiles(x86)%\Mozilla Firefox\firefox.exe" (
    set "FIREFOX_PATH=%ProgramFiles(x86)%\Mozilla Firefox\firefox.exe"
    goto :firefox_found
)
if exist "%LocalAppData%\Mozilla Firefox\firefox.exe" (
    set "FIREFOX_PATH=%LocalAppData%\Mozilla Firefox\firefox.exe"
    goto :firefox_found
)

echo Firefox not found in standard locations.
echo Please install Firefox first or load the extension manually.
pause
exit /b 1

:firefox_found
echo Firefox found: %FIREFOX_PATH%

echo.
echo [2/3] Opening Firefox with add-ons page...
echo.

REM Get current directory
set "EXT_DIR=%CD%"

REM Open Firefox with add-ons page
start "" "%FIREFOX_PATH%" about:addons

echo [3/3] Extension loading initiated!
echo.
echo NEXT STEPS:
echo 1. Firefox should open with the Add-ons page
echo 2. Click the gear icon (⚙️) in the top-right
echo 3. Select "Install Add-on From File..."
echo 4. Navigate to this folder and select manifest.json:
echo    "%EXT_DIR%"
echo 5. Click "Add" when prompted
echo.
echo Press any key to close this window...
pause >nul