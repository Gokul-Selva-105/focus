@echo off
REM Deployment script for Jarvis Self-Development App (Windows)
REM This script handles building and deploying the application on Windows

echo 🚀 Starting deployment process...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo Please select deployment option:
echo 1) Docker Compose (Recommended for local/staging)
echo 2) Production Build
echo 3) Local Development
echo 4) Exit

set /p choice=Enter your choice (1-4): 

if "%choice%"=="1" goto docker_deploy
if "%choice%"=="2" goto production_deploy
if "%choice%"=="3" goto local_dev
if "%choice%"=="4" goto exit_script

echo ❌ Invalid option. Please run the script again.
pause
exit /b 1

:docker_deploy
echo 📦 Building and starting services with Docker Compose...

REM Stop existing containers
docker-compose down

REM Build and start services
docker-compose up --build -d

echo ✅ Services started successfully!
echo 🌐 Application: http://localhost:3000
echo 🗄️  MongoDB Express: http://localhost:8081 (admin/admin)
echo 📊 MongoDB: localhost:27017
goto end

:production_deploy
echo 🏭 Preparing for production deployment...

REM Check if production environment file exists
if not exist ".env.local" (
    echo ⚠️  .env.local not found. Please create it from .env.production template.
    pause
    exit /b 1
)

REM Build the application
echo 🔨 Building Next.js application...
npm run build

echo ✅ Build completed! Ready for production deployment.
echo 📝 Next steps:
echo    1. Upload the .next folder to your server
echo    2. Install production dependencies: npm ci --only=production
echo    3. Start the application: npm start
goto end

:local_dev
echo 💻 Starting local development server...

REM Check if .env.local exists, if not create from example
if not exist ".env.local" (
    echo 📝 Creating .env.local from .env.example...
    copy .env.example .env.local
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Start development server
echo 🚀 Starting development server...
npm run dev
goto end

:exit_script
echo 👋 Goodbye!
exit /b 0

:end
echo 🎉 Deployment process completed!
pause