import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaTimes, FaChevronLeft, FaChevronRight, FaHome, FaPlay, FaPause, FaSync, FaMusic, FaTrash, FaEllipsisV, FaUser } from 'react-icons/fa';
import axios from 'axios';
import PhotoInteractions from './PhotoInteractions';
import { useAudio } from '../contexts/AudioContext';

const GalleryContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  padding-top: 20px; /* Add top padding for header */
  padding-bottom: 100px; /* Increased space for footer */
  position: relative;

  @media (max-width: 768px) {
    padding: 15px 10px 90px 10px;
    padding-top: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 8px 80px 8px;
    padding-top: 10px;
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

const Header = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: transparent;
  flex-wrap: wrap;
  gap: 15px;
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  z-index: 1000;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 16px 12px;
    margin-bottom: 20px;
    top: 15px;
    left: 15px;
    right: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 8px;
    gap: 12px;
    margin-bottom: 15px;
    top: 10px;
    left: 10px;
    right: 10px;
  }
`;

const Title = styled.h1`
  color: white;
  font-family: 'Pacifico', cursive;
  font-size: 2.2rem;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 1px;
  line-height: 1.1;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    justify-content: center;
    text-align: center;
    width: 100%;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
    gap: 6px;
  }
  
  @media (max-width: 360px) {
    font-size: 1.2rem;
  }
`;

const HeaderControls = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    justify-content: center;
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }
`;

const NavButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
    padding: 12px 16px;
    font-size: 1rem;
  }
`;

const MusicControl = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
  
  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
    font-size: 1.1rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.15);
  padding: 8px 16px;
  border-radius: 25px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    padding: 12px;
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const UserName = styled.span`
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const UserEmail = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const LogoutButton = styled.button`
  background: rgba(231, 76, 60, 0.8);
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e74c3c;
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.9rem;
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

const UserInfoContainer = styled.div`
  position: relative;
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

const GalleryGrid = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 25px;
  max-width: 600px;
  margin: 0 auto;
  margin-top: 120px; /* Space for fixed header */
  width: 100%;
  
  @media (max-width: 768px) {
    gap: 20px;
    max-width: 500px;
    margin-top: 140px; /* More space for stacked header on mobile */
  }
  
  @media (max-width: 480px) {
    gap: 18px;
    max-width: 100%;
    margin-top: 160px; /* Even more space for mobile */
  }
`;

const ImageCard = styled(motion.div)`
  position: relative;
  border-radius: 15px;
  overflow: visible;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 480px) {
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const Image = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  transition: transform 0.3s ease;
  border-radius: 15px;
  
  ${ImageCard}:hover & {
    transform: scale(1.02);
  }
  
  @media (max-width: 768px) {
    height: 350px;
  }
  
  @media (max-width: 480px) {
    height: 300px;
    
    ${ImageCard}:hover & {
      transform: scale(1.01);
    }
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 20px;
  color: white;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  
  ${ImageCard}:hover & {
    transform: translateY(0);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: white;
  font-size: 1.2rem;
`;

const Lightbox = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const LightboxImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 10px;
`;

const LightboxControls = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
`;

const LightboxButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const NavigationButtons = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
  pointer-events: none;
`;

const NavButtonLightbox = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const PhotoActionsMenu = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 3;
  
  @media (max-width: 768px) {
    top: 8px;
    right: 8px;
  }
  
  @media (max-width: 480px) {
    top: 6px;
    right: 6px;
  }
`;

const MenuButton = styled.button`
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
`;

const MenuDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(15px);
  border-radius: 8px;
  padding: 4px 0;
  min-width: 80px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 10;
  
  @media (max-width: 480px) {
    min-width: 100px;
  }
`;

const MenuItem = styled.button`
  background: transparent;
  border: none;
  color: white;
  padding: 6px 12px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  

  
  @media (max-width: 480px) {
    padding: 8px 14px;
    font-size: 0.9rem;
  }
`;

const MessageButton = styled(motion.button)`
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
  transition: all 0.3s ease;
  font-family: 'Pacifico', cursive;
  letter-spacing: 1px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(255, 107, 107, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
`;

const FooterMessage = styled.div`
  color: white;
  font-family: 'Pacifico', cursive;
  font-size: 1.2rem;
  text-align: center;
  padding: 20px 0;
  letter-spacing: 1.5px;
  text-shadow: 
    0 0 20px rgba(255, 255, 255, 1),
    0 2px 10px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(255, 255, 255, 0.8);
  user-select: none;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 16px 0;
    letter-spacing: 1.2px;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 12px 0;
    letter-spacing: 1px;
  }
`;

const Gallery = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const { isPlaying, toggleMusic } = useAudio();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [showPersonDropdown, setShowPersonDropdown] = useState(false);

  const generateHearts = () => {
    const hearts = [];
    const numHearts = 60; // Increased from 40 to 60
    
    // Create a more structured distribution with some randomness
    for (let i = 0; i < numHearts; i++) {
      let x, y;
      
      // Use a mix of grid-based and random positioning for better distribution
      if (i < numHearts * 0.7) {
        // 70% of hearts use grid-based positioning with some randomness
        const gridSize = 8; // 8x8 grid
        const gridX = (i % gridSize) * (100 / gridSize);
        const gridY = Math.floor(i / gridSize) * (100 / gridSize);
        x = gridX + (Math.random() - 0.5) * 15; // Add some randomness to grid positions
        y = gridY + (Math.random() - 0.5) * 15;
      } else {
        // 30% of hearts use completely random positioning
        x = Math.random() * 100;
        y = Math.random() * 100;
      }
      
      // Ensure hearts stay within bounds
      x = Math.max(5, Math.min(95, x));
      y = Math.max(5, Math.min(95, y));
      
      hearts.push({
        id: i,
        x: x,
        y: y,
        size: Math.random() * 20 + 10,
        delay: Math.random() * 3 // Increased delay range for more varied animation
      });
    }
    return hearts;
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Auto-refresh when coming from upload page
  useEffect(() => {
    const isFromUpload = sessionStorage.getItem('fromUpload');
    if (isFromUpload) {
      sessionStorage.removeItem('fromUpload');
      fetchImages();
    }
  }, []);

  const fetchImages = async () => {
    try {
      setIsRefreshing(true);
      const response = await axios.get('http://localhost:8080/api/images');
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };



  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyPress = (e) => {
    if (selectedImage) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenu(null);
      setShowPersonDropdown(false);
    };

    if (openMenu || showPersonDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenu, showPersonDropdown]);

  const handleDeletePhoto = async (image) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    setDeleting(true);
    setOpenMenu(null); // Close menu after action
    try {
      await axios.delete(`http://localhost:8080/api/images/${encodeURIComponent(image)}`);
      setImages((prev) => prev.filter((img) => img !== image));
      // Close lightbox if the deleted image was selected
      if (selectedImage === image) {
        closeLightbox();
      }
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000);
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert(`Failed to delete photo: ${error.response?.data || error.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const toggleMenu = (imageName, e) => {
    e.stopPropagation();
    setOpenMenu(openMenu === imageName ? null : imageName);
  };

  const closeMenu = () => {
    setOpenMenu(null);
  };

  const togglePersonDropdown = (e) => {
    e.stopPropagation();
    setShowPersonDropdown(!showPersonDropdown);
  };

  const handleHomeClick = () => {
    setShowPersonDropdown(false);
    fetchImages();
    navigate('/');
  };

  const handleLogoutClick = () => {
    setShowPersonDropdown(false);
    onLogout();
  };

  if (loading) {
    return (
      <GalleryContainer>
        <LoadingContainer>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            ❤️
          </motion.div>
          <span style={{ marginLeft: '10px' }}>Loading our memories...</span>
        </LoadingContainer>
        <FooterMessage>
          Made with ❤️ by the one who loves you the most
        </FooterMessage>
      </GalleryContainer>
    );
  }

  return (
    <>
      <GalleryContainer>
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
        
        <Header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title>
            Our Story in Pictures 💕
          </Title>
          <HeaderControls>
            <WelcomeMessage>Welcome, {currentUser.username}!</WelcomeMessage>
            <MusicControl
              onClick={toggleMusic}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={isPlaying ? 'Pause Music' : 'Play Music'}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </MusicControl>
            {currentUser && (
              <UserInfoContainer>
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
                      <DropdownItem onClick={handleHomeClick}>
                        Home
                      </DropdownItem>
                      <DropdownItem onClick={handleLogoutClick}>
                        Logout
                      </DropdownItem>
                    </PersonDropdown>
                  )}
                </AnimatePresence>
              </UserInfoContainer>
            )}
          </HeaderControls>
        </Header>

        <GalleryGrid
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {images.map((image, index) => (
            <ImageCard
              key={image}
              layoutId={`image-${index}`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '15px' }}>
                <Image
                  src={`http://localhost:8080/api/images/${image}`}
                  alt={`Memory ${index + 1}`}
                  loading="lazy"
                  onClick={() => openLightbox(image, index)}
                  style={{ cursor: 'pointer' }}
                />
                <PhotoActionsMenu>
                  <MenuButton
                    onClick={(e) => toggleMenu(image, e)}
                    disabled={deleting}
                    title="Photo actions"
                  >
                    <FaEllipsisV />
                  </MenuButton>
                  <AnimatePresence>
                    {openMenu === image && (
                      <MenuDropdown
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <MenuItem 
                          onClick={(e) => { e.stopPropagation(); handleDeletePhoto(image); }} 
                          disabled={deleting}
                        >
                          Delete
                        </MenuItem>
                      </MenuDropdown>
                    )}
                  </AnimatePresence>
                </PhotoActionsMenu>
                <ImageOverlay>
                  <div>Memory #{index + 1}</div>
                </ImageOverlay>
                <PhotoInteractions photoName={image} show={true} />
              </div>
            </ImageCard>
          ))}
        </GalleryGrid>

        {deleteSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              background: '#27ae60',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '10px',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            ✅ Photo deleted successfully!
          </motion.div>
        )}

        <AnimatePresence>
          {selectedImage && (
            <Lightbox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
            >
              <LightboxControls>
                <LightboxButton onClick={closeLightbox}>
                  <FaTimes />
                </LightboxButton>
              </LightboxControls>

              <NavigationButtons>
                <NavButtonLightbox onClick={prevImage}>
                  <FaChevronLeft />
                </NavButtonLightbox>
                <NavButtonLightbox onClick={nextImage}>
                  <FaChevronRight />
                </NavButtonLightbox>
              </NavigationButtons>

              <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
                <LightboxImage
                  src={`http://localhost:8080/api/images/${images[currentIndex]}`}
                  alt={`Memory ${currentIndex + 1}`}
                  onClick={(e) => e.stopPropagation()}
                />
                <PhotoActionsMenu style={{ position: 'absolute', top: '20px', right: '20px' }}>
                  <MenuButton
                    onClick={(e) => toggleMenu(images[currentIndex], e)}
                    disabled={deleting}
                    title="Photo actions"
                  >
                    <FaEllipsisV />
                  </MenuButton>
                  <AnimatePresence>
                    {openMenu === images[currentIndex] && (
                      <MenuDropdown
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <MenuItem 
                          onClick={(e) => { e.stopPropagation(); handleDeletePhoto(images[currentIndex]); }} 
                          disabled={deleting}
                        >
                          Delete
                        </MenuItem>
                      </MenuDropdown>
                    )}
                  </AnimatePresence>
                </PhotoActionsMenu>
                <PhotoInteractions photoName={images[currentIndex]} show={true} />
              </div>
            </Lightbox>
          )}
        </AnimatePresence>
      </GalleryContainer>
      
      <MessageButton
        onClick={() => navigate('/message')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ margin: '10px auto', display: 'block' }}
      >
        💕 Message for You My Love 💕
      </MessageButton>
      
      <FooterMessage>
        Made with ❤️ by the one who loves you the most
      </FooterMessage>
    </>
  );
};

export default Gallery; 