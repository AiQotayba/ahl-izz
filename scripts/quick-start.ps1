# Quick Start script for Donation Hub (Windows PowerShell)

Write-Host "🚀 Donation Hub - Quick Start" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Step 1: Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Blue

$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue
$npmInstalled = Get-Command npm -ErrorAction SilentlyContinue

if (-not $nodeInstalled) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

$nodeVersion = node --version
Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green

if (-not $npmInstalled) {
    Write-Host "❌ npm is not installed." -ForegroundColor Red
    exit 1
}

$npmVersion = npm --version
Write-Host "✅ npm: $npmVersion" -ForegroundColor Green

# Step 2: Setup environment
Write-Host ""
Write-Host "🔧 Setting up environment..." -ForegroundColor Blue

if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Cyan
    Copy-Item "env.example" ".env"
    Write-Host "✅ .env file created" -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Step 3: Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue

# Clean previous installations
if (Test-Path "node_modules") {
    Write-Host "🧹 Cleaning previous installations..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
}

# Use npm-compatible package.json
if (Test-Path "package-npm.json") {
    Copy-Item "package-npm.json" "package.json" -Force
    Write-Host "📝 Using npm-compatible configuration..." -ForegroundColor Cyan
}

# Install root dependencies
Write-Host "📦 Installing root dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Install workspace dependencies
Write-Host "📦 Installing workspace dependencies..." -ForegroundColor Cyan

# Types
if (Test-Path "packages/types") {
    Write-Host "  - Types package..." -ForegroundColor White
    cd packages/types
    npm install
    npm run build
    cd ../..
}

# API
if (Test-Path "apps/api") {
    Write-Host "  - API package..." -ForegroundColor White
    cd apps/api
    npm install
    cd ../..
}

# Web
if (Test-Path "apps/web") {
    Write-Host "  - Web package..." -ForegroundColor White
    cd apps/web
    npm install
    cd ../..
}

# UI
if (Test-Path "packages/ui") {
    Write-Host "  - UI package..." -ForegroundColor White
    cd packages/ui
    npm install
    cd ../..
}

# Step 4: Start MongoDB
Write-Host ""
Write-Host "🍃 Starting MongoDB..." -ForegroundColor Blue

# Check if MongoDB is running
$mongodbProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if (-not $mongodbProcess) {
    Write-Host "⚠️  MongoDB is not running. Starting with Docker..." -ForegroundColor Yellow
    
    # Try Docker
    if (Get-Command docker -ErrorAction SilentlyContinue) {
        docker run -d -p 27017:27017 --name mongodb mongo:7.0
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ MongoDB started with Docker" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to start MongoDB with Docker" -ForegroundColor Red
            Write-Host "💡 Please start MongoDB manually or install it locally" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Docker not found. Please start MongoDB manually:" -ForegroundColor Red
        Write-Host "   - Install MongoDB locally, or" -ForegroundColor Yellow
        Write-Host "   - Use MongoDB Atlas (cloud), or" -ForegroundColor Yellow
        Write-Host "   - Install Docker and run: docker run -d -p 27017:27017 mongo:7.0" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ MongoDB is already running" -ForegroundColor Green
}

# Step 5: Seed database
Write-Host ""
Write-Host "🌱 Seeding database..." -ForegroundColor Blue

cd apps/api
npm run db:seed
cd ../..

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database seeded successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️  Database seeding failed (MongoDB might not be running)" -ForegroundColor Yellow
}

# Step 6: Start development servers
Write-Host ""
Write-Host "🎯 Starting development servers..." -ForegroundColor Blue
Write-Host ""
Write-Host "Services will be available at:" -ForegroundColor Cyan
Write-Host "  - Web App: http://localhost:3000" -ForegroundColor White
Write-Host "  - API Server: http://localhost:3001" -ForegroundColor White
Write-Host "  - Admin Panel: http://localhost:3000/admin" -ForegroundColor White
Write-Host ""
Write-Host "Default admin credentials:" -ForegroundColor Cyan
Write-Host "  - Email: admin@donationhub.com" -ForegroundColor White
Write-Host "  - Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow
Write-Host ""

# Start development
npm run dev
