# Install script for Donation Hub (Windows PowerShell)

Write-Host "📦 Installing Donation Hub dependencies..." -ForegroundColor Green

# Check if pnpm is installed
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ pnpm is not installed. Installing pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
}

# Try pnpm first
Write-Host "🔧 Trying pnpm install..." -ForegroundColor Blue
$pnpmResult = $false

try {
    pnpm install --no-frozen-lockfile
    if ($LASTEXITCODE -eq 0) {
        $pnpmResult = $true
        Write-Host "✅ pnpm install successful!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  pnpm install failed, trying npm..." -ForegroundColor Yellow
}

# Fallback to npm if pnpm fails
if (-not $pnpmResult) {
    Write-Host "🔧 Trying npm install..." -ForegroundColor Blue
    
    # Check if npm is available
    if (Get-Command npm -ErrorAction SilentlyContinue) {
        try {
            npm install
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ npm install successful!" -ForegroundColor Green
                Write-Host "⚠️  Note: Using npm instead of pnpm. Some features may not work as expected." -ForegroundColor Yellow
            } else {
                Write-Host "❌ Both pnpm and npm failed. Please check your network connection." -ForegroundColor Red
                exit 1
            }
        } catch {
            Write-Host "❌ npm install also failed. Please check your network connection." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "❌ Neither pnpm nor npm is available. Please install Node.js first." -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Copy env.example to .env and configure it" -ForegroundColor White
Write-Host "2. Start MongoDB" -ForegroundColor White
Write-Host "3. Run: pnpm run dev (or npm run dev)" -ForegroundColor White

