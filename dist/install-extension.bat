@echo off

echo.
echo ================================================
echo   Palestinian Domain Blocker - Quick Install
echo ================================================
echo.

REM Check if we're in the right directory
if not exist "manifest.json" (
    echo Error: manifest.json not found!
    echo Please run this script from the extension directory.
    pause
    exit /b 1
)

echo [1/3] Checking Chrome installation...

REM Find Chrome executable
set "CHROME_PATH="
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
    goto :chrome_found
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
    goto :chrome_found
)
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=%LocalAppData%\Google\Chrome\Application\chrome.exe"
    goto :chrome_found
)

echo Chrome not found in standard locations.
echo Please install Chrome first or load the extension manually.
pause
exit /b 1

:chrome_found
echo Chrome found: %CHROME_PATH%

echo.
echo [2/3] Opening Chrome with extension loading page...
echo.

REM Get current directory
set "EXT_DIR=%CD%"

REM Open Chrome with extensions page
start "" "%CHROME_PATH%" --new-window chrome://extensions/

echo [3/3] Extension loading initiated!
echo.
echo NEXT STEPS:
echo 1. Chrome should open with the Extensions page
echo 2. If "Developer mode" is OFF, toggle it ON (top-right)
echo 3. The extension should load automatically
echo 4. If not, click "Load unpacked" and select this folder:
echo    "%EXT_DIR%"
echo.
echo Press any key to close this window...
pause >nul