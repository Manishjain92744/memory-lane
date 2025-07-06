import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaHeart, FaHome, FaUser } from 'react-icons/fa';
import axios from 'axios';

const MessageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 15px 10px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 8px;
  }
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
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'Pacifico', cursive;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 12px;
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

const UserInfoContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 10;
  
  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    top: 10px;
    right: 10px;
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

const LogoutButton = styled.button`
  background: rgba(255, 107, 107, 0.8);
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 107, 107, 1);
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

const MessageDisplay = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 182, 193, 0.25) 0%, rgba(186, 104, 200, 0.25) 100%);
  backdrop-filter: blur(18px) saturate(120%);
  border: 2.5px solid rgba(255, 255, 255, 0.35);
  border-radius: 32px;
  padding: 48px 36px;
  margin: 32px 0 32px 0;
  color: #fff;
  font-size: 1.7rem;
  line-height: 1.7;
  text-align: center;
  max-width: 700px;
  box-shadow: 0 8px 40px 0 rgba(255, 107, 170, 0.18), 0 2px 32px 0 rgba(186, 104, 200, 0.12);
  font-family: 'Pacifico', 'Caveat', cursive, sans-serif;
  letter-spacing: 1.2px;
  position: relative;
  overflow: visible;
  animation: floatBox 6s ease-in-out infinite;

  @keyframes floatBox {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  &::before, &::after {
    content: '💖';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 2.2rem;
    opacity: 0.7;
    filter: blur(0.5px);
    pointer-events: none;
    animation: heartFloat 4s ease-in-out infinite;
  }
  &::before {
    top: -2.2rem;
    animation-delay: 0s;
  }
  &::after {
    bottom: -2.2rem;
    animation-delay: 2s;
  }

  @keyframes heartFloat {
    0% { opacity: 0.7; transform: translateX(-50%) scale(1); }
    50% { opacity: 1; transform: translateX(-50%) scale(1.15); }
    100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 32px 16px;
    border-radius: 22px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.05rem;
    padding: 18px 6px;
    border-radius: 14px;
  }
`;

const LoadingText = styled.div`
  color: white;
  font-size: 1.2rem;
  text-align: center;
  margin: 20px 0;
`;

const ErrorText = styled.div`
  color: #ff6b6b;
  font-size: 1.1rem;
  text-align: center;
  margin: 20px 0;
  font-style: italic;
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

const MessagePage = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/messages/latest');
        setMessage(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching message:', error);
        setError('No message found');
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, []);

  return (
    <MessageContainer>
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
          <UserInfo>
            Welcome, {currentUser.username}!
          </UserInfo>
          <LogoutButton onClick={onLogout}>
            Logout
          </LogoutButton>
        </UserInfoContainer>
      )}

      <Content>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: '3rem', marginBottom: '20px' }}
        >
          💕
        </motion.div>
        
        <Title
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Special Message for you Sunshine ✨
        </Title>
        
        {loading ? (
          <LoadingText
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Loading your special message... 💕
          </LoadingText>
        ) : error ? (
          <ErrorText
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {error}
          </ErrorText>
        ) : message ? (
          <MessageDisplay
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {message.content}
          </MessageDisplay>
        ) : (
          <Subtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            This space is reserved for something very special... 💝
          </Subtitle>
        )}
        
        <ButtonContainer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <Button
            className="primary"
            onClick={() => navigate('/gallery')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaHeart /> Back to Gallery
          </Button>
          
          <Button
            className="secondary"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaHome /> Home
          </Button>
        </ButtonContainer>
      </Content>
      
      <FooterMessage>
        Made with ❤️ by the one who loves you the most
      </FooterMessage>
    </MessageContainer>
  );
};

export default MessagePage; 