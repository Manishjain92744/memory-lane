# Memory Lane - A Romantic Photo Gallery ❤️

A beautiful, personalized web application to showcase your love story through photos. This is the perfect surprise gift for your significant other - a digital journey through your memories together.

## ✨ Features

- **Beautiful Landing Page**: Romantic welcome with floating hearts and background music
- **Photo Gallery**: Grid layout with smooth animations and hover effects
- **Lightbox View**: Fullscreen photo preview with navigation
- **Background Music**: Optional romantic background music
- **Upload System**: Easy drag-and-drop photo upload
- **Mobile Responsive**: Works perfectly on phones and tablets
- **Cloud Storage**: Photos stored securely in Cloudflare R2

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Java 21 (for backend)
- Cloudflare R2 account (free tier available)

### Backend Setup

1. **Navigate to the Spring Boot project:**
   ```bash
   cd ../Java/Spring_demo_project
   ```

2. **Configure Cloudflare R2:**
   Create `src/main/resources/application.properties`:
   ```properties
   cloud.aws.credentials.access-key=your_r2_access_key
   cloud.aws.credentials.secret-key=your_r2_secret_key
   cloud.aws.bucket=your_bucket_name
   cloud.aws.endpoint=https://your_account_id.r2.cloudflarestorage.com
   ```

3. **Run the backend:**
   ```bash
   ./gradlew bootRun
   ```
   The API will be available at `http://localhost:8080`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add background music (optional):**
   Place a romantic music file named `romantic-music.mp3` in the `public/` folder

3. **Start the development server:**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

## 📱 How to Use

### For You (Setting up the surprise):

1. **Upload Photos**: Go to `/upload` and drag-and-drop your photos
2. **Organize**: Photos will be displayed in chronological order
3. **Test**: Preview the gallery to ensure everything looks perfect

### For Your Loved One:

1. **Open the Link**: Share the deployed URL with them
2. **Enjoy the Journey**: They'll see the beautiful landing page
3. **Browse Memories**: Click "Enter Our Memories" to view the gallery
4. **Fullscreen View**: Click any photo for a fullscreen experience

## 🎨 Customization

### Personalize the Experience

1. **Change the Title**: Edit the title in `HomePage.js`
2. **Custom Message**: Modify the final message in `Gallery.js`
3. **Colors**: Update the gradient colors in the styled components
4. **Music**: Replace the background music file

### Styling Customization

The app uses styled-components for easy customization:

```javascript
// Change the main gradient
background: linear-gradient(135deg, #your_color1 0%, #your_color2 100%);

// Update button colors
background: linear-gradient(45deg, #your_accent1, #your_accent2);
```

## 🌐 Deployment

### Frontend Deployment (Netlify - Free)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag the `build/` folder to Netlify
   - Or connect your GitHub repository

3. **Update API URL:**
   Change `localhost:8080` to your deployed backend URL in:
   - `Gallery.js`
   - `UploadPage.js`

### Backend Deployment (Render - Free)

1. **Create a Render account**
2. **Connect your GitHub repository**
3. **Set environment variables:**
   - `CLOUD_AWS_CREDENTIALS_ACCESS_KEY`
   - `CLOUD_AWS_CREDENTIALS_SECRET_KEY`
   - `CLOUD_AWS_BUCKET`
   - `CLOUD_AWS_ENDPOINT`

## �� API Endpoints

- `POST /api/upload` - Upload a photo
- `GET /api/images` - Get all photo filenames
- `GET /api/images/{filename}` - Get a specific photo

## 💡 Tips for the Perfect Surprise

1. **Photo Selection**: Choose photos that tell your story chronologically
2. **Quality**: Use high-quality images for the best experience
3. **Variety**: Mix candid shots with posed photos
4. **Timing**: Deploy a few days before the surprise to test everything
5. **Presentation**: Consider adding a personal note or video message

## 🎵 Background Music

For the best experience, add a romantic background music file:
- Format: MP3
- Duration: 3-5 minutes (will loop)
- Volume: Keep it subtle (30% volume in the app)

## 🔒 Privacy & Security

- Photos are stored securely in Cloudflare R2
- No personal data is collected
- The gallery is private (only accessible via the link you share)

## 🛠️ Troubleshooting

### Common Issues

1. **Photos not loading**: Check your R2 bucket permissions
2. **Upload fails**: Verify your R2 credentials
3. **CORS errors**: Ensure backend CORS is configured correctly
4. **Music not playing**: Modern browsers require user interaction for autoplay

### Getting Help

- Check the browser console for error messages
- Verify all environment variables are set correctly
- Test the API endpoints directly using Postman

## 💝 Why This Makes a Great Gift

- **Personal**: Shows thoughtfulness and effort
- **Technical**: Demonstrates your skills
- **Emotional**: Creates a lasting digital memory
- **Accessible**: Can be viewed anytime, anywhere
- **Unique**: More special than sharing a folder

## 📄 License

This project is created with love ❤️

---

**Made with ❤️ for the one you love the most** 