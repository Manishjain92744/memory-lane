import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../contexts/AudioContext';
import Login from './Login';
import Signup from './Signup';
import HomePage from './HomePage';
import Gallery from './Gallery';
import UploadPage from './UploadPage';
import MusicUploadPage from './MusicUploadPage';
import MessagePage from './MessagePage';

const AuthWrapperContainer = styled.div`
  min-height: 100vh;
`;

const AuthWrapper = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const { stopMusic } = useAudio();

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleSignupSuccess = (user) => {
    // After successful signup, switch to login
    setShowLogin(true);
  };

  const handleLogout = () => {
    stopMusic(); // Stop the music when user logs out
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setShowLogin(true);
  };

  const switchToSignup = () => {
    setShowLogin(false);
  };

  const switchToLogin = () => {
    setShowLogin(true);
  };

  if (isAuthenticated) {
    // Render different components based on the current route
    switch (location.pathname) {
      case '/gallery':
        return (
          <AuthWrapperContainer>
            <Gallery currentUser={currentUser} onLogout={handleLogout} />
          </AuthWrapperContainer>
        );
      case '/upload':
        return (
          <AuthWrapperContainer>
            <UploadPage currentUser={currentUser} onLogout={handleLogout} />
          </AuthWrapperContainer>
        );
      case '/upload/music':
        return (
          <AuthWrapperContainer>
            <MusicUploadPage currentUser={currentUser} onLogout={handleLogout} />
          </AuthWrapperContainer>
        );
      case '/message':
        return (
          <AuthWrapperContainer>
            <MessagePage currentUser={currentUser} onLogout={handleLogout} />
          </AuthWrapperContainer>
        );
      default:
        return (
          <AuthWrapperContainer>
            <HomePage currentUser={currentUser} onLogout={handleLogout} />
          </AuthWrapperContainer>
        );
    }
  }

  return (
    <AuthWrapperContainer>
      <AnimatePresence mode="wait">
        {showLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <Login 
              onLoginSuccess={handleLoginSuccess}
              onSwitchToSignup={switchToSignup}
            />
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Signup 
              onSignupSuccess={handleSignupSuccess}
              onSwitchToLogin={switchToLogin}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AuthWrapperContainer>
  );
};

export default AuthWrapper; 