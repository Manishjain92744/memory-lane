#!/bin/bash

echo "🎉 Memory Lane - Romantic Photo Gallery Deployment Script"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the Frontend directory"
    exit 1
fi

echo "📦 Building the application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Deployment Options:"
    echo "1. Netlify (Recommended - Free)"
    echo "2. Vercel (Free)"
    echo "3. GitHub Pages (Free)"
    echo ""
    echo "📁 Your build files are ready in the 'build/' directory"
    echo ""
    echo "🌐 For Netlify deployment:"
    echo "   - Go to https://netlify.com"
    echo "   - Drag and drop the 'build/' folder"
    echo "   - Your site will be live instantly!"
    echo ""
    echo "🔧 Don't forget to:"
    echo "   - Update API URLs in Gallery.js and UploadPage.js"
    echo "   - Replace romantic-music.mp3 with your own music"
    echo "   - Test the gallery before sharing"
    echo ""
    echo "💝 Your romantic surprise is almost ready!"
else
    echo "❌ Build failed. Please check for errors above."
    exit 1
fi 