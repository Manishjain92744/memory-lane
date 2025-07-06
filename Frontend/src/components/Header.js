import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  /* Add subtle animation */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: shimmer 3s infinite;
  }
  
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
  
  @media (max-width: 768px) {
    padding: 25px 20px;
  }
  
  @media (max-width: 480px) {
    padding: 20px 15px;
  }
  
  @media (max-width: 360px) {
    padding: 18px 12px;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 1;
  
  /* Add text shadow for better readability */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 360px) {
    font-size: 1.4rem;
  }
`;

const Subtitle = styled.p`
  margin: 10px 0 0 0;
  font-size: 1.1rem;
  opacity: 0.9;
  font-weight: 300;
  position: relative;
  z-index: 1;
  
  /* Add text shadow for better readability */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 8px 0 0 0;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin: 6px 0 0 0;
  }
  
  @media (max-width: 360px) {
    font-size: 0.85rem;
    margin: 5px 0 0 0;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Title>📸 Image Upload</Title>
      <Subtitle>Upload and preview your images with style</Subtitle>
    </HeaderContainer>
  );
};

export default Header; 