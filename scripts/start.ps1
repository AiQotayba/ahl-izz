# Start script for Donation Hub (Windows PowerShell)

Write-Host "🚀 Starting Donation Hub..." -ForegroundColor Green

# Check if pnpm is installed
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ pnpm is not installed. Please install pnpm first:" -ForegroundColor Red
    Write-Host "   npm install -g pnpm" -ForegroundColor Yellow
    exit 1
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found. Please create it from env.example first." -ForegroundColor Red
    exit 1
}

# Check if MongoDB is running
Write-Host "🔍 Checking MongoDB connection..." -ForegroundColor Blue

# Build if needed
if (-not (Test-Path "apps/api/dist") -or -not (Test-Path "apps/web/.next")) {
    Write-Host "🔨 Building applications..." -ForegroundColor Blue
    pnpm run build
}

# Start the application
Write-Host "🚀 Starting Donation Hub..." -ForegroundColor Blue
Write-Host ""
Write-Host "Services will be available at:" -ForegroundColor Cyan
Write-Host "- Web App: http://localhost:3000" -ForegroundColor White
Write-Host "- API Server: http://localhost:3001" -ForegroundColor White
Write-Host "- Admin Panel: http://localhost:3000/admin" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

pnpm run dev

