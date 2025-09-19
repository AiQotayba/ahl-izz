# Start MongoDB script (Windows PowerShell)

Write-Host "🍃 Starting MongoDB for Donation Hub..." -ForegroundColor Green

# Check if MongoDB is installed
if (-not (Get-Command mongod -ErrorAction SilentlyContinue)) {
    Write-Host "❌ MongoDB is not installed locally." -ForegroundColor Red
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "1. Install MongoDB locally" -ForegroundColor White
    Write-Host "2. Use Docker: docker run -d -p 27017:27017 --name mongodb mongo:7.0" -ForegroundColor White
    Write-Host "3. Use MongoDB Atlas (cloud)" -ForegroundColor White
    Write-Host ""
    
    $choice = Read-Host "Choose option (1/2/3)"
    
    if ($choice -eq "2") {
        Write-Host "🐳 Starting MongoDB with Docker..." -ForegroundColor Blue
        docker run -d -p 27017:27017 --name mongodb mongo:7.0
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ MongoDB started successfully on port 27017" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to start MongoDB with Docker" -ForegroundColor Red
        }
    } elseif ($choice -eq "3") {
        Write-Host "☁️  Please update your .env file with MongoDB Atlas connection string" -ForegroundColor Yellow
    } else {
        Write-Host "📥 Please install MongoDB from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    }
    exit 0
}

# Check if MongoDB is already running
$mongodbProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if ($mongodbProcess) {
    Write-Host "✅ MongoDB is already running" -ForegroundColor Green
    exit 0
}

# Create data directory if it doesn't exist
$dataDir = "C:\data\db"
if (-not (Test-Path $dataDir)) {
    Write-Host "📁 Creating MongoDB data directory..." -ForegroundColor Blue
    New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
}

# Start MongoDB
Write-Host "🚀 Starting MongoDB..." -ForegroundColor Blue
Start-Process -FilePath "mongod" -ArgumentList "--dbpath", $dataDir -WindowStyle Hidden

# Wait a moment for MongoDB to start
Start-Sleep -Seconds 3

# Check if MongoDB started successfully
$mongodbProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if ($mongodbProcess) {
    Write-Host "✅ MongoDB started successfully on port 27017" -ForegroundColor Green
    Write-Host "📊 Database: donation-hub" -ForegroundColor Cyan
} else {
    Write-Host "❌ Failed to start MongoDB" -ForegroundColor Red
    Write-Host "💡 Try running as Administrator or check MongoDB installation" -ForegroundColor Yellow
}
