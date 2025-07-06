# Memory Lane - Free Deployment Guide

This guide will help you deploy your Memory Lane app for free using Vercel (frontend) and Railway/Render (backend).

## 🚀 Quick Start

### Option 1: Vercel + Railway (Recommended)
- **Frontend**: Vercel (completely free)
- **Backend**: Railway (free tier with $5 credit/month)

### Option 2: Vercel + Render
- **Frontend**: Vercel (completely free)
- **Backend**: Render (free tier with limitations)

## 📋 Prerequisites

1. **GitHub Account** - Free at github.com
2. **Vercel Account** - Free at vercel.com
3. **Railway Account** - Free at railway.app (or Render at render.com)

## 🔧 Step 1: Prepare Your Repository

### 1.1 Create a GitHub Repository
```bash
# Initialize git in your project folder
cd /Users/manishkumar/Documents/Project
git init
git add .
git commit -m "Initial commit - Memory Lane app"
```

### 1.2 Create GitHub Repository
1. Go to github.com and create a new repository
2. Name it: `memory-lane-app`
3. Make it public
4. Don't initialize with README (we already have files)

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/memory-lane-app.git
git branch -M main
git push -u origin main
```

## 🎨 Step 2: Deploy Frontend to Vercel

### 2.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "New Project"
4. Import your `memory-lane-app` repository

### 2.2 Configure Frontend Deployment
1. **Framework Preset**: Select "Create React App"
2. **Root Directory**: `Frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `build`
5. **Install Command**: `npm install`

### 2.3 Environment Variables
Add these environment variables in Vercel:
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

### 2.4 Deploy
Click "Deploy" and wait for the build to complete.

## ⚙️ Step 3: Deploy Backend to Railway

### 3.1 Connect to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Click "New Project"
4. Select "Deploy from GitHub repo"

### 3.2 Configure Backend Deployment
1. Select your `memory-lane-app` repository
2. **Root Directory**: `Java/Spring_demo_project`
3. Railway will automatically detect it's a Java project

### 3.3 Environment Variables
Add these in Railway:
```
PORT=8080
SPRING_PROFILES_ACTIVE=production
```

### 3.4 Deploy
Railway will automatically build and deploy your Spring Boot app.

## 🔗 Step 4: Connect Frontend to Backend

### 4.1 Update API URL
Once your backend is deployed, get the URL from Railway and update your frontend:

1. Go to your Vercel project settings
2. Update the `REACT_APP_API_URL` environment variable with your Railway backend URL
3. Redeploy the frontend

### 4.2 Update CORS Configuration
Update your backend CORS configuration to allow your Vercel domain:

```java
// In WebConfig.java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "https://your-app.vercel.app",
        "http://localhost:3000"
    ));
    // ... rest of configuration
}
```

## 🌐 Alternative: Render Deployment

If you prefer Render over Railway:

### Render Backend Setup
1. Go to [render.com](https://render.com)
2. Create account and connect GitHub
3. Create new "Web Service"
4. Select your repository
5. **Root Directory**: `Java/Spring_demo_project`
6. **Build Command**: `./gradlew build`
7. **Start Command**: `java -jar build/libs/Spring_demo_project-0.0.1-SNAPSHOT.jar`
8. **Environment**: `Java`

## 📱 Testing Your Deployment

1. **Frontend**: Visit your Vercel URL (e.g., `https://memory-lane-app.vercel.app`)
2. **Backend**: Test API endpoints at your Railway/Render URL
3. **Full App**: Test the complete user flow

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your backend CORS configuration includes your frontend domain
2. **Build Failures**: Check the build logs in Vercel/Railway
3. **Port Issues**: Ensure your backend uses the `PORT` environment variable
4. **File Upload Issues**: Check if your deployment platform supports file uploads

### Debug Commands:
```bash
# Test backend locally
cd Java/Spring_demo_project
./gradlew bootRun

# Test frontend locally
cd Frontend
npm start
```

## 💰 Cost Breakdown

- **Vercel**: Completely free for personal projects
- **Railway**: Free tier with $5 credit/month (sufficient for small apps)
- **Render**: Free tier with some limitations
- **Total Cost**: $0

## 🎉 Success!

Once deployed, your Memory Lane app will be accessible to anyone with an internet connection!

**Your app URLs will be:**
- Frontend: `https://your-app-name.vercel.app`
- Backend: `https://your-app-name.railway.app` (or render.com)

## 📞 Support

If you encounter issues:
1. Check the deployment logs in Vercel/Railway
2. Verify environment variables are set correctly
3. Test locally first to ensure everything works
4. Check the troubleshooting section above

Happy deploying! 🚀 