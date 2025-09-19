# Install script using npm (Windows PowerShell)

Write-Host "📦 Installing Donation Hub dependencies with npm..." -ForegroundColor Green

# Check if npm is installed
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Clean previous installations
Write-Host "🧹 Cleaning previous installations..." -ForegroundColor Blue
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}
if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json"
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Installation failed. Please check your network connection." -ForegroundColor Red
    exit 1
}

# Install dependencies for each workspace
Write-Host "📦 Installing workspace dependencies..." -ForegroundColor Blue

# API dependencies
if (Test-Path "apps/api") {
    Write-Host "Installing API dependencies..." -ForegroundColor Cyan
    cd apps/api
    npm install
    cd ../..
}

# Web dependencies
if (Test-Path "apps/web") {
    Write-Host "Installing Web dependencies..." -ForegroundColor Cyan
    cd apps/web
    npm install
    cd ../..
}

# Types dependencies
if (Test-Path "packages/types") {
    Write-Host "Installing Types dependencies..." -ForegroundColor Cyan
    cd packages/types
    npm install
    cd ../..
}

# UI dependencies
if (Test-Path "packages/ui") {
    Write-Host "Installing UI dependencies..." -ForegroundColor Cyan
    cd packages/ui
    npm install
    cd ../..
}

Write-Host "✅ All dependencies installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Copy env.example to .env and configure it" -ForegroundColor White
Write-Host "2. Start MongoDB" -ForegroundColor White
Write-Host "3. Run: npm run dev" -ForegroundColor White

