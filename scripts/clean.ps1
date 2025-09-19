# Clean script for Donation Hub (Windows PowerShell)

Write-Host "🧹 Cleaning Donation Hub project..." -ForegroundColor Yellow

# Remove node_modules
if (Test-Path "node_modules") {
    Write-Host "Removing node_modules..." -ForegroundColor Blue
    Remove-Item -Recurse -Force "node_modules"
}

# Remove dist folders
$distFolders = @(
    "apps/api/dist",
    "apps/web/.next",
    "apps/web/out",
    "packages/types/dist",
    "packages/ui/dist"
)

foreach ($folder in $distFolders) {
    if (Test-Path $folder) {
        Write-Host "Removing $folder..." -ForegroundColor Blue
        Remove-Item -Recurse -Force $folder
    }
}

# Remove logs
if (Test-Path "apps/api/logs") {
    Write-Host "Removing logs..." -ForegroundColor Blue
    Remove-Item -Recurse -Force "apps/api/logs"
    New-Item -ItemType Directory -Path "apps/api/logs" -Force | Out-Null
}

# Remove lock files (optional)
$removeLock = Read-Host "Remove lock files? (y/N)"
if ($removeLock -eq "y" -or $removeLock -eq "Y") {
    if (Test-Path "pnpm-lock.yaml") {
        Write-Host "Removing pnpm-lock.yaml..." -ForegroundColor Blue
        Remove-Item "pnpm-lock.yaml"
    }
}

Write-Host "✅ Clean completed!" -ForegroundColor Green
Write-Host "Run 'pnpm install' to reinstall dependencies." -ForegroundColor Cyan
