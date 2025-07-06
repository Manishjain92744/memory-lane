import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaPlay, FaPause, FaMusic, FaUser } from 'react-icons/fa';
import { useAudio } from '../contexts/AudioContext';

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, 0.8) 0%, 
    rgba(118, 75, 162, 0.8) 50%,
    rgba(255, 182, 193, 0.6) 100%);
  z-index: 1;
`;

const FloatingHearts = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  pointer-events: none;
`;

const Heart = styled(motion.div)`
  position: absolute;
  color: rgba(255, 255, 255, 0.3);
  font-size: ${props => props.size}px;
  animation: float 6s ease-in-out infinite;
`;

const Content = styled(motion.div)`
  position: relative;
  z-index: 3;
  text-align: center;
  max-width: 800px;
  padding: 40px;
  
  @media (max-width: 768px) {
    padding: 30px 20px;
  }
  
  @media (max-width: 480px) {
    padding: 20px 15px;
  }
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 12px;
  }
  
  @media (max-width: 360px) {
    font-size: 1.6rem;
  }
`;

const DelhiWelcome = styled(motion.h2)`
  font-size: 1.8rem;
  color: #ff6b6b;
  margin-bottom: 15px;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-family: 'Pacifico', cursive;
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
    margin-bottom: 10px;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
  font-weight: 300;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 30px;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 25px;
  }
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 15px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }
`;

const Button = styled(motion.button)`
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: white;
  white-space: nowrap;
  
  &.primary {
    background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(255, 107, 107, 0.4);
    }
  }
  
  &.secondary {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
  }
  
  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 1rem;
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
    padding: 16px 24px;
    font-size: 1.1rem;
    gap: 10px;
  }
`;

const MusicControlsContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  z-index: 10;
  
  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    top: 10px;
    right: 10px;
    gap: 6px;
    flex-direction: column;
  }
`;



const FooterMessage = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  color: white;
  font-family: 'Pacifico', cursive;
  font-size: 1.2rem;
  text-align: center;
  padding: 12px 0 16px 0;
  z-index: 9999;
  letter-spacing: 1.5px;
  text-shadow: 
    0 0 20px rgba(255, 255, 255, 1),
    0 2px 10px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(255, 255, 255, 0.8);
  pointer-events: none;
  user-select: none;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 10px 0 14px 0;
    letter-spacing: 1.2px;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 8px 0 12px 0;
    letter-spacing: 1px;
  }
`;

const MusicLogoutContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;
  
  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    top: 10px;
    right: 10px;
    gap: 6px;
  }
`;

const MusicSelector = styled.select`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 12px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
  max-width: 160px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  appearance: none;
  text-align: center;

  option {
    background: #333;
    color: white;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 6px 10px;
    max-width: 140px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 5px 8px;
    max-width: 120px;
  }
`;

const MusicControl = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 5px 10px;
  }
`;

const HeartIcon = styled(motion.div)`
  font-size: 3rem;
  color: #ff6b6b;
  margin-bottom: 20px;
  animation: pulse 2s ease-in-out infinite;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 12px;
  }
`;

const UserInfoContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 10;
  
  @media (max-width: 768px) {
    top: 15px;
    left: 15px;
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    top: 10px;
    left: 10px;
    gap: 8px;
  }
`;

const UserInfo = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 8px 16px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 5px 10px;
  }
`;



const WelcomeMessage = styled.div`
  color: #fefefe;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  padding: 8px 16px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 107, 157, 0.9) 0%, rgba(196, 69, 105, 0.9) 50%, rgba(255, 142, 142, 0.9) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(255, 107, 157, 0.4);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 6px 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 5px 10px;
  }
`;

const PersonIcon = styled(motion.button)`
  border: none;
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: scale(1.1);
  }
  
  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
    font-size: 1.1rem;
  }
`;

const PersonDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  min-width: 150px;
  z-index: 1001;
  
  @media (max-width: 480px) {
    min-width: 140px;
  }
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: #333;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
  
  &:first-child {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 480px) {
    padding: 14px 16px;
    font-size: 1rem;
  }
`;

const HomePage = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const { isPlaying, musicFiles, currentMusic, toggleMusic, changeMusic } = useAudio();
  const [showPersonDropdown, setShowPersonDropdown] = useState(false);

  const generateHearts = () => {
    const hearts = [];
    for (let i = 0; i < 40; i++) {
      hearts.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
        delay: Math.random() * 2
      });
    }
    return hearts;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowPersonDropdown(false);
    };

    if (showPersonDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showPersonDropdown]);

  const togglePersonDropdown = (e) => {
    e.stopPropagation();
    setShowPersonDropdown(!showPersonDropdown);
  };

  const handleLogoutClick = () => {
    setShowPersonDropdown(false);
    onLogout();
  };

  return (
    <HomeContainer>
      <BackgroundOverlay />
      
      <FloatingHearts>
        {generateHearts().map(heart => (
          <Heart
            key={heart.id}
            size={heart.size}
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: heart.delay,
            }}
          >
            ❤️
          </Heart>
        ))}
      </FloatingHearts>

      {currentUser && (
        <UserInfoContainer>
          <WelcomeMessage>
            Welcome, {currentUser.username}!
          </WelcomeMessage>
        </UserInfoContainer>
      )}
      
      <MusicControlsContainer>
        {musicFiles.length > 0 && isPlaying && (
          <MusicSelector
            value={currentMusic || ''}
            onChange={(e) => {
              changeMusic(e.target.value);
            }}
          >
            {musicFiles.map(music => (
              <option key={music} value={music}>
                {music.replace(/\.(mp3|wav|m4a)$/i, '')}
              </option>
            ))}
          </MusicSelector>
        )}
        <MusicControl
          onClick={toggleMusic}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
          {isPlaying ? 'Pause' : 'Play'}
        </MusicControl>
        {currentUser && (
          <div style={{ position: 'relative' }}>
            <PersonIcon
              onClick={togglePersonDropdown}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="User menu"
              style={{
                background: currentUser.profilePicture ? 'transparent' : 'rgba(255, 255, 255, 0.2)',
                padding: 0,
                border: 'none'
              }}
            >
              {currentUser.profilePicture ? (
                <img 
                  src={`http://localhost:8080/api/auth/profile-pictures/${currentUser.profilePicture}`}
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                />
              ) : (
                <FaUser />
              )}
            </PersonIcon>
            <AnimatePresence>
              {showPersonDropdown && (
                <PersonDropdown
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <DropdownItem onClick={handleLogoutClick}>
                    Logout
                  </DropdownItem>
                </PersonDropdown>
              )}
            </AnimatePresence>
          </div>
        )}
      </MusicControlsContainer>

      <Content>
        <HeartIcon
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ❤️
        </HeartIcon>
        
        <DelhiWelcome
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
        >
          Welcome to Delhi My Love 💕
        </DelhiWelcome>
        
        <Title
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Memory Lane
        </Title>
        
        <Subtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          A Journey of Us • Our Love Story in Pictures
        </Subtitle>
        
        <ButtonContainer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <Button
            className="primary"
            onClick={() => navigate('/gallery')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaHeart /> Enter Our Memories
          </Button>
          
          <Button
            className="secondary"
            onClick={() => navigate('/upload')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaHeart /> Add Photos
          </Button>
          
          <Button
            className="secondary"
            onClick={() => navigate('/upload/music')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaMusic /> Add Music
          </Button>
        </ButtonContainer>
      </Content>
      
      <FooterMessage>
        Made with ❤️ by the one who loves you the most
      </FooterMessage>
    </HomeContainer>
  );
};

export default HomePage; 