#!/bin/bash

# Development startup script for Donation Hub

echo "🚀 Starting Donation Hub Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found. Please install and start MongoDB."
    echo "   You can use Docker: docker run -d -p 27017:27017 mongo:7.0"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Create logs directory
mkdir -p apps/api/logs

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your configuration before continuing."
    echo "   Press Enter when ready..."
    read
fi

# Start the development servers
echo "🎯 Starting development servers..."
echo "   - API Server: http://localhost:3001"
echo "   - Web App: http://localhost:3000"
echo "   - Admin Panel: http://localhost:3000/admin"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start with turbo
pnpm run dev
