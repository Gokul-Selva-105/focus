#!/bin/bash

# Deployment script for Jarvis Self-Development App
# This script handles building and deploying the application

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Function to deploy with Docker Compose
deploy_docker() {
    echo "📦 Building and starting services with Docker Compose..."
    
    # Stop existing containers
    docker-compose down
    
    # Build and start services
    docker-compose up --build -d
    
    echo "✅ Services started successfully!"
    echo "🌐 Application: http://localhost:3000"
    echo "🗄️  MongoDB Express: http://localhost:8081 (admin/admin)"
    echo "📊 MongoDB: localhost:27017"
}

# Function to deploy to production
deploy_production() {
    echo "🏭 Preparing for production deployment..."
    
    # Check if production environment file exists
    if [ ! -f ".env.local" ]; then
        echo "⚠️  .env.local not found. Please create it from .env.production template."
        exit 1
    fi
    
    # Build the application
    echo "🔨 Building Next.js application..."
    npm run build
    
    echo "✅ Build completed! Ready for production deployment."
    echo "📝 Next steps:"
    echo "   1. Upload the .next folder to your server"
    echo "   2. Install production dependencies: npm ci --only=production"
    echo "   3. Start the application: npm start"
}

# Function to run locally
run_local() {
    echo "💻 Starting local development server..."
    
    # Check if .env.local exists, if not create from example
    if [ ! -f ".env.local" ]; then
        echo "📝 Creating .env.local from .env.example..."
        cp .env.example .env.local
    fi
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    npm install
    
    # Start development server
    echo "🚀 Starting development server..."
    npm run dev
}

# Main menu
echo "Please select deployment option:"
echo "1) Docker Compose (Recommended for local/staging)"
echo "2) Production Build"
echo "3) Local Development"
echo "4) Exit"

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        deploy_docker
        ;;
    2)
        deploy_production
        ;;
    3)
        run_local
        ;;
    4)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid option. Please run the script again."
        exit 1
        ;;
esac

echo "🎉 Deployment process completed!"