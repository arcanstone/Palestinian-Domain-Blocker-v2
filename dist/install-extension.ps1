# Palestinian Domain Blocker - PowerShell Installer
param(
    [switch]$AutoReload
)

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "   Palestinian Domain Blocker - Quick Install" -ForegroundColor Green  
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Check if manifest exists
if (-not (Test-Path "manifest.json")) {
    Write-Host "Error: manifest.json not found!" -ForegroundColor Red
    Write-Host "Please run this script from the extension directory." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[1/4] Checking Chrome installation..." -ForegroundColor Yellow

# Find Chrome executable
$chromePaths = @(
    "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe", 
    "${env:LocalAppData}\Google\Chrome\Application\chrome.exe"
)

$chromePath = $null
foreach ($path in $chromePaths) {
    if (Test-Path $path) {
        $chromePath = $path
        break
    }
}

if (-not $chromePath) {
    Write-Host "Chrome not found in standard locations." -ForegroundColor Red
    Write-Host "Please install Chrome first or load the extension manually." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Chrome found: $chromePath" -ForegroundColor Green

Write-Host ""
Write-Host "[2/4] Preparing extension directory..." -ForegroundColor Yellow

$extensionDir = Get-Location
Write-Host "Extension directory: $extensionDir" -ForegroundColor Green

Write-Host ""
Write-Host "[3/4] Opening Chrome with extensions page..." -ForegroundColor Yellow

# Open Chrome with extensions page
Start-Process -FilePath $chromePath -ArgumentList "--new-window", "chrome://extensions/"

# Wait a moment
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "[4/4] Extension ready for loading!" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Chrome should open with the Extensions page" -ForegroundColor White
Write-Host "2. Toggle 'Developer mode' ON (top-right switch)" -ForegroundColor White  
Write-Host "3. Click 'Load unpacked' button" -ForegroundColor White
Write-Host "4. Select this folder:" -ForegroundColor White
Write-Host "   $extensionDir" -ForegroundColor Gray
Write-Host ""
Write-Host "Extension will be installed and ready to use!" -ForegroundColor Green
Write-Host ""

if ($AutoReload) {
    Write-Host "Auto-reload mode: Script will close in 5 seconds..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
} else {
    Read-Host "Press Enter to close"
}