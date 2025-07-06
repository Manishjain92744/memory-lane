# Memory Lane 🌹

A romantic photo gallery and music app that captures your journey of love through beautiful memories.

## ✨ Features

- **Photo Gallery**: Upload and share romantic photos with your loved one
- **Music Player**: Add romantic background music to enhance the mood
- **Message System**: Leave sweet messages for each other
- **User Authentication**: Secure login and registration
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Updates**: Instant updates when new content is added

## 🛠️ Technology Stack

### Frontend
- React 18
- Styled Components
- Framer Motion
- React Router
- Axios

### Backend
- Spring Boot 3.5.3
- Java 21
- Gradle
- JSON file storage
- File upload handling

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Java 21
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/memory-lane.git
   cd memory-lane
   ```

2. **Start the Backend**
   ```bash
   cd Java/Spring_demo_project
   ./gradlew bootRun
   ```

3. **Start the Frontend**
   ```bash
   cd Frontend
   npm install
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8080

## 📱 Deployment

This project is configured for free deployment on:
- **Frontend**: Vercel
- **Backend**: Railway or Render

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## 🎨 UI/UX Features

- **Romantic Theme**: Pink and purple gradient design
- **Glass Morphism**: Modern glass-like UI elements
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Layout**: Works perfectly on mobile and desktop
- **User-Friendly**: Intuitive navigation and interactions

## 🔧 API Endpoints

- `GET /api/users` - Get all users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Create new message
- `POST /api/upload` - Upload photos
- `POST /api/music/upload` - Upload music files

## 📁 Project Structure

```
memory-lane/
├── Frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   └── styles/          # Styled components
│   └── public/              # Static assets
├── Java/Spring_demo_project/ # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/memorylane/
│   │       ├── controller/  # REST controllers
│   │       ├── model/       # Data models
│   │       ├── service/     # Business logic
│   │       └── Repo/        # Data repositories
│   └── data/                # JSON data files
└── DEPLOYMENT_GUIDE.md      # Deployment instructions
```

## 🎯 Future Enhancements

- [ ] Real-time chat functionality
- [ ] Photo filters and editing
- [ ] Music playlist creation
- [ ] Push notifications
- [ ] Dark mode theme
- [ ] Social sharing features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 💝 Made with Love

Memory Lane is built with love for couples who want to preserve their romantic moments together. ❤️

---

**Happy sharing your memories!** 🌹✨ 