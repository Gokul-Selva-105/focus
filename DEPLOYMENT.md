# 🚀 Jarvis Self-Development App - Deployment Guide

This guide covers multiple deployment options for the Jarvis Self-Development App, from local development to production deployment.

## 📋 Prerequisites

- **Node.js** 18+ installed
- **Docker** and **Docker Compose** (for containerized deployment)
- **MongoDB** (local or cloud instance)
- **Git** for version control

## 🎯 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd jarvis

# Run deployment script
# On Linux/Mac:
./deploy.sh

# On Windows:
deploy.bat

# Select option 1 for Docker Compose
```

### Option 2: Manual Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your MongoDB connection
# Start development server
npm run dev
```

## 🐳 Docker Deployment

### Local Development with Docker

```bash
# Build and start all services
docker-compose up --build

# Access the application
# App: http://localhost:3000
# MongoDB Express: http://localhost:8081 (admin/admin)
# MongoDB: localhost:27017
```

### Production Docker Deployment

```bash
# Build production image
docker build -t jarvis-app .

# Run with external MongoDB
docker run -p 3000:3000 \
  -e MONGODB_URI="your-mongodb-connection-string" \
  -e NEXTAUTH_SECRET="your-secret-key" \
  -e NEXTAUTH_URL="https://your-domain.com" \
  jarvis-app
```

## ☁️ Cloud Deployment

### Vercel (Recommended for Next.js)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Environment Variables**
   Set these in Vercel dashboard:
   ```
   MONGODB_URI=mongodb+srv://...
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

### Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18

2. **Environment Variables**
   Same as Vercel configuration

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### DigitalOcean App Platform

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set run command: `npm start`
4. Add environment variables

## 🗄️ Database Setup

### MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in environment variables

### Local MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Using MongoDB Community Edition
# Follow installation guide for your OS
```

## 🔧 Environment Configuration

### Required Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/self-development-app

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Optional
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Generating NEXTAUTH_SECRET

```bash
# Generate a secure secret
openssl rand -base64 32

# Or use online generator
# https://generate-secret.vercel.app/32
```

## 🔍 Health Checks

### Application Health

```bash
# Check if app is running
curl http://localhost:3000/api/health

# Check MongoDB connection
curl http://localhost:3000/api/db-status
```

### Docker Health Checks

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs app
docker-compose logs mongodb
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   ```bash
   # Check MongoDB is running
   docker-compose logs mongodb
   
   # Verify connection string
   echo $MONGODB_URI
   ```

2. **Build Failures**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   
   # Clear node_modules
   rm -rf node_modules
   npm install
   ```

3. **Port Already in Use**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   
   # Kill process
   kill -9 <PID>
   ```

### Performance Optimization

1. **Enable Compression**
   ```javascript
   // next.config.js
   module.exports = {
     compress: true,
     // ... other config
   }
   ```

2. **Database Indexing**
   ```javascript
   // Ensure indexes are created (handled by mongo-init.js)
   db.users.createIndex({ email: 1 })
   db.meals.createIndex({ userEmail: 1, date: 1 })
   ```

## 📊 Monitoring

### Application Metrics

- **Uptime**: Monitor `/api/health` endpoint
- **Database**: Monitor MongoDB connection
- **Performance**: Use Next.js built-in analytics

### Logging

```bash
# View application logs
docker-compose logs -f app

# View database logs
docker-compose logs -f mongodb
```

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit `.env.local` to version control
   - Use strong, unique secrets
   - Rotate secrets regularly

2. **Database Security**
   - Enable MongoDB authentication
   - Use connection string with credentials
   - Restrict database access by IP

3. **HTTPS**
   - Always use HTTPS in production
   - Update `NEXTAUTH_URL` to use `https://`

## 📝 Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Security audit
npm audit
npm audit fix

# Rebuild Docker images
docker-compose build --no-cache
```

### Backup

```bash
# Backup MongoDB data
docker exec mongodb mongodump --out /backup

# Copy backup from container
docker cp mongodb:/backup ./mongodb-backup
```

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review application logs
3. Verify environment configuration
4. Check MongoDB connection

---

**Happy Deploying! 🎉**