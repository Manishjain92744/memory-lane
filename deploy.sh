#!/bin/bash

echo "🚀 Memory Lane Deployment Script"
echo "================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - Memory Lane app"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo ""
    echo "🔗 Please add your GitHub repository as remote origin:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/memory-lane.git"
    echo "git branch -M main"
    echo "git push -u origin main"
    echo ""
else
    echo "✅ Remote origin already configured"
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. Create a GitHub repository at github.com"
echo "2. Push your code to GitHub"
echo "3. Deploy frontend to Vercel (vercel.com)"
echo "4. Deploy backend to Railway (railway.app) or Render (render.com)"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
echo "🎉 Happy deploying!" 