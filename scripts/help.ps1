# Help script for Donation Hub (Windows PowerShell)

Write-Host "📚 Donation Hub - Available Commands" -ForegroundColor Green
Write-Host ""

Write-Host "🔧 Setup Commands:" -ForegroundColor Cyan
Write-Host "  .\scripts\setup.ps1     - Initial project setup" -ForegroundColor White
Write-Host "  .\scripts\clean.ps1     - Clean build artifacts" -ForegroundColor White
Write-Host ""

Write-Host "🚀 Development Commands:" -ForegroundColor Cyan
Write-Host "  .\scripts\dev.ps1       - Start development servers" -ForegroundColor White
Write-Host "  .\scripts\start.ps1     - Start production servers" -ForegroundColor White
Write-Host "  .\scripts\build.ps1     - Build all applications" -ForegroundColor White
Write-Host ""

Write-Host " Database Commands:" -ForegroundColor Cyan
Write-Host "  .\scripts\seed.ps1      - Seed database with admin user" -ForegroundColor White
Write-Host ""

Write-Host "📦 pnpm Commands:" -ForegroundColor Cyan
Write-Host "  pnpm install            - Install dependencies" -ForegroundColor White
Write-Host "  pnpm run dev            - Start development" -ForegroundColor White
Write-Host "  pnpm run build          - Build all apps" -ForegroundColor White
Write-Host "  pnpm run lint           - Lint code" -ForegroundColor White
Write-Host "  pnpm run type-check     - Type check" -ForegroundColor White
Write-Host "  pnpm run clean          - Clean build artifacts" -ForegroundColor White
Write-Host ""

Write-Host "🐳 Docker Commands:" -ForegroundColor Cyan
Write-Host "  cd infra/docker" -ForegroundColor White
Write-Host "  docker-compose up -d    - Start all services" -ForegroundColor White
Write-Host "  docker-compose down     - Stop all services" -ForegroundColor White
Write-Host ""

Write-Host "📖 Documentation:" -ForegroundColor Cyan
Write-Host "  README.md               - Full documentation" -ForegroundColor White
Write-Host "  setup.md                - Project requirements" -ForegroundColor White
Write-Host ""

Write-Host "🌐 URLs:" -ForegroundColor Cyan
Write-Host "  Web App: http://localhost:3000" -ForegroundColor White
Write-Host "  API: http://localhost:3001" -ForegroundColor White
Write-Host "  Admin: http://localhost:3000/admin" -ForegroundColor White
Write-Host ""

Write-Host "🔑 Default Admin Credentials:" -ForegroundColor Cyan
Write-Host "  Email: admin@donationhub.com" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  Remember to change default passwords in production!" -ForegroundColor Yellow

