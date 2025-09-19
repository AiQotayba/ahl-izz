# Development startup script for Donation Hub (Windows PowerShell)

Write-Host "🚀 Starting Donation Hub Development Environment..." -ForegroundColor Green

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if pnpm is installed
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ pnpm is not installed. Please install pnpm first:" -ForegroundColor Red
    Write-Host "   npm install -g pnpm" -ForegroundColor Yellow
    exit 1
}

# Check if MongoDB is running
if (-not (Get-Command mongod -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  MongoDB not found. Please install and start MongoDB." -ForegroundColor Yellow
    Write-Host "   You can use Docker: docker run -d -p 27017:27017 mongo:7.0" -ForegroundColor Yellow
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
    pnpm install
}

# Create logs directory
if (-not (Test-Path "apps/api/logs")) {
    New-Item -ItemType Directory -Path "apps/api/logs" -Force | Out-Null
}

# Copy environment file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Blue
    Copy-Item "env.example" ".env"
    Write-Host "⚠️  Please edit .env file with your configuration before continuing." -ForegroundColor Yellow
    Write-Host "   Press Enter when ready..." -ForegroundColor Yellow
    Read-Host
}

# Start the development servers
Write-Host "🎯 Starting development servers..." -ForegroundColor Green
Write-Host "   - API Server: http://localhost:3001" -ForegroundColor Cyan
Write-Host "   - Web App: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   - Admin Panel: http://localhost:3000/admin" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow
Write-Host ""

# Start with turbo
pnpm run dev

