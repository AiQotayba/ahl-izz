# Setup script for Donation Hub (Windows PowerShell)

Write-Host "🔧 Setting up Donation Hub Development Environment..." -ForegroundColor Green

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check Node.js version
$nodeVersion = node --version
Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green

# Install pnpm if not installed
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing pnpm..." -ForegroundColor Blue
    npm install -g pnpm
} else {
    $pnpmVersion = pnpm --version
    Write-Host "✅ pnpm version: $pnpmVersion" -ForegroundColor Green
}

# Install dependencies
Write-Host "📦 Installing project dependencies..." -ForegroundColor Blue
pnpm install

# Create necessary directories
Write-Host "📁 Creating necessary directories..." -ForegroundColor Blue
New-Item -ItemType Directory -Path "apps/api/logs" -Force | Out-Null
New-Item -ItemType Directory -Path "packages/types/dist" -Force | Out-Null

# Copy environment file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Blue
    Copy-Item "env.example" ".env"
    Write-Host "⚠️  Please edit .env file with your configuration." -ForegroundColor Yellow
}

# Build shared packages
Write-Host "🔨 Building shared packages..." -ForegroundColor Blue
cd packages/types
pnpm run build
cd ../..

Write-Host "✅ Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env file with your configuration" -ForegroundColor White
Write-Host "2. Start MongoDB (or use Docker)" -ForegroundColor White
Write-Host "3. Run: pnpm run dev" -ForegroundColor White
Write-Host "4. Seed admin user: pnpm run db:seed" -ForegroundColor White

