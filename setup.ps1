# Quick Start Script for AkhdarNas
# This script will guide you through the initial setup

Write-Host "🚀 AkhdarNas Setup Script" -ForegroundColor Green
Write-Host "=" * 50

# Step 1: Check Node.js
Write-Host "`n1. Checking Node.js installation..." -ForegroundColor Cyan
node --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js is installed" -ForegroundColor Green

# Step 2: Configure Git (if not configured)
Write-Host "`n2. Configuring Git..." -ForegroundColor Cyan
$gitUser = git config user.name
if ([string]::IsNullOrEmpty($gitUser)) {
    Write-Host "Git user not configured. Setting up..." -ForegroundColor Yellow
    $name = Read-Host "Enter your name"
    $email = Read-Host "Enter your email"
    git config --global user.name "$name"
    git config --global user.email "$email"
    Write-Host "✅ Git configured" -ForegroundColor Green
} else {
    Write-Host "✅ Git already configured for: $gitUser" -ForegroundColor Green
}

# Step 3: Install backend dependencies
Write-Host "`n3. Installing backend dependencies..." -ForegroundColor Cyan
cd server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green

# Step 4: Setup .env
Write-Host "`n4. Setting up environment variables..." -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Created .env file from template" -ForegroundColor Green
    Write-Host "⚠️  IMPORTANT: Edit server/.env and update DATABASE_URL" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env already exists" -ForegroundColor Green
}

Write-Host "`n" + ("=" * 50)
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Install PostgreSQL (if not installed)" -ForegroundColor White
Write-Host "2. Edit server/.env with your database URL" -ForegroundColor White
Write-Host "3. Run: npm run prisma:generate" -ForegroundColor White
Write-Host "4. Run: npm run prisma:migrate" -ForegroundColor White
Write-Host "5. Run: npm run start:dev" -ForegroundColor White
Write-Host "`n📚 See SETUP.md for detailed instructions" -ForegroundColor Cyan
