# Seed script for Donation Hub (Windows PowerShell)

Write-Host "🌱 Seeding Donation Hub database..." -ForegroundColor Green

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

# Build API if needed
if (-not (Test-Path "apps/api/dist")) {
    Write-Host "🔨 Building API..." -ForegroundColor Blue
    cd apps/api
    pnpm run build
    cd ../..
}

# Run seed script
Write-Host "🌱 Running database seed..." -ForegroundColor Blue
cd apps/api
pnpm run db:seed
cd ../..

Write-Host "✅ Database seeded successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Default admin credentials:" -ForegroundColor Cyan
Write-Host "Email: admin@donationhub.com" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Please change the default password after first login!" -ForegroundColor Yellow

