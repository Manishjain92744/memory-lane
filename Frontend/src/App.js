import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import AuthWrapper from './components/AuthWrapper';
import HomePage from './components/HomePage';
import Gallery from './components/Gallery';
import UploadPage from './components/UploadPage';
import MusicUploadPage from './components/MusicUploadPage';
import MessagePage from './components/MessagePage';
import GlobalStyle from './styles/GlobalStyle';
import { AudioProvider } from './contexts/AudioContext';

const AppContainer = styled(motion.div)`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Poppins', sans-serif;
`;

function App() {
  return (
    <AudioProvider>
      <Router>
        <GlobalStyle />
        <AppContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Routes>
            <Route path="/" element={<AuthWrapper />} />
            <Route path="/gallery" element={<AuthWrapper />} />
            <Route path="/upload" element={<AuthWrapper />} />
            <Route path="/upload/music" element={<AuthWrapper />} />
            <Route path="/message" element={<AuthWrapper />} />
          </Routes>
        </AppContainer>
      </Router>
    </AudioProvider>
  );
}

export default App; 