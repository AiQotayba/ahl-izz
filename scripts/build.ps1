# Build script for Donation Hub (Windows PowerShell)

Write-Host "🔨 Building Donation Hub project..." -ForegroundColor Green

# Check if pnpm is installed
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ pnpm is not installed. Please install pnpm first:" -ForegroundColor Red
    Write-Host "   npm install -g pnpm" -ForegroundColor Yellow
    exit 1
}

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
    pnpm install
}

# Build shared packages first
Write-Host "🔨 Building shared packages..." -ForegroundColor Blue
cd packages/types
pnpm run build
cd ../..

# Build API
Write-Host "🔨 Building API..." -ForegroundColor Blue
cd apps/api
pnpm run build
cd ../..

# Build Web
Write-Host "🔨 Building Web application..." -ForegroundColor Blue
cd apps/web
pnpm run build
cd ../..

Write-Host "✅ Build completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Built applications:" -ForegroundColor Cyan
Write-Host "- API: apps/api/dist" -ForegroundColor White
Write-Host "- Web: apps/web/.next" -ForegroundColor White
Write-Host "- Types: packages/types/dist" -ForegroundColor White

