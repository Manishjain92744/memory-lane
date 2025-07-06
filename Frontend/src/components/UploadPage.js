import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaCloudUploadAlt, FaHome, FaCheck, FaTimes, FaMusic, FaUser } from 'react-icons/fa';
import axios from 'axios';

const UploadContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
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

const Header = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    padding: 16px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    gap: 12px;
    margin-bottom: 15px;
  }
`;

const Title = styled.h1`
  color: white;
  font-size: 2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
    gap: 6px;
  }
`;

const NavButton = styled(motion.button)`
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  white-space: nowrap;
  
  &.primary {
    background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
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
    padding: 10px 20px;
    font-size: 0.9rem;
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
    padding: 14px 20px;
    font-size: 1rem;
    gap: 8px;
  }
`;

const UserInfoContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10;
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

const LeftUserInfoContainer = styled.div`
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
  &:hover { transform: scale(1.1); }
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
  @media (max-width: 480px) { min-width: 140px; }
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
  &:hover { background: rgba(102, 126, 234, 0.1); color: #667eea; }
  &:first-child { border-bottom: 1px solid rgba(0, 0, 0, 0.1); }
  @media (max-width: 480px) { padding: 14px 16px; font-size: 1rem; }
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

const UploadArea = styled(motion.div)`
  width: 100%;
  max-width: 800px;
  background: linear-gradient(135deg, rgba(255, 182, 193, 0.18) 0%, rgba(186, 104, 200, 0.18) 100%);
  backdrop-filter: blur(16px) saturate(120%);
  border-radius: 28px;
  border: 2.5px dashed rgba(255, 255, 255, 0.35);
  padding: 70px 48px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(.4,2,.3,1);
  box-shadow: 0 8px 40px 0 rgba(255, 107, 170, 0.13), 0 2px 32px 0 rgba(186, 104, 200, 0.10);
  font-family: 'Pacifico', 'Caveat', cursive, sans-serif;
  position: relative;
  overflow: visible;

  &:hover {
    border-color: #ff6b6b;
    background: linear-gradient(135deg, rgba(255, 182, 193, 0.28) 0%, rgba(186, 104, 200, 0.28) 100%);
    box-shadow: 0 12px 48px 0 rgba(255, 107, 170, 0.18), 0 4px 40px 0 rgba(186, 104, 200, 0.15);
    transform: scale(1.02) translateY(-2px);
  }

  &::before {
    content: '💖';
    position: absolute;
    top: -2.2rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 2.2rem;
    opacity: 0.7;
    filter: blur(0.5px);
    pointer-events: none;
    animation: heartFloat 4s ease-in-out infinite;
  }

  @keyframes heartFloat {
    0% { opacity: 0.7; transform: translateX(-50%) scale(1); }
    50% { opacity: 1; transform: translateX(-50%) scale(1.15); }
    100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
  }

  @media (max-width: 768px) {
    padding: 40px 20px;
    border-radius: 18px;
  }
  
  @media (max-width: 480px) {
    padding: 30px 10px;
    border-radius: 12px;
  }
`;

const UploadText = styled.div`
  color: #fff;
  font-size: 1.5rem;
  margin-bottom: 10px;
  font-family: 'Pacifico', 'Caveat', cursive, sans-serif;
  letter-spacing: 1.2px;
  text-shadow: 0 2px 8px rgba(255, 107, 170, 0.18);
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.05rem;
    margin-bottom: 6px;
  }
`;

const UploadSubtext = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const ProgressContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    margin-top: 15px;
  }
  
  @media (max-width: 480px) {
    margin-top: 12px;
  }
`;

const ProgressItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  
  @media (max-width: 768px) {
    padding: 16px;
    gap: 12px;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    gap: 10px;
    margin-bottom: 10px;
  }
`;

const ProgressIcon = styled.div`
  font-size: 1.5rem;
  color: ${props => {
    if (props.status === 'success') return '#4CAF50';
    if (props.status === 'error') return '#f44336';
    return 'rgba(255, 255, 255, 0.7)';
  }};
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const ProgressInfo = styled.div`
  flex: 1;
`;

const ProgressFileName = styled.div`
  color: white;
  font-weight: 500;
  margin-bottom: 5px;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 3px;
  }
`;

const ProgressStatus = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 8px;
  
  @media (max-width: 480px) {
    margin-top: 6px;
  }
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  border-radius: 2px;
`;

const SuccessMessage = styled(motion.div)`
  background: rgba(76, 175, 80, 0.9);
  color: white;
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  margin-top: 20px;
  font-weight: 600;
  
  @media (max-width: 768px) {
    padding: 16px;
    margin-top: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    margin-top: 12px;
    font-size: 0.9rem;
  }
`;

const ErrorMessage = styled(motion.div)`
  background: rgba(244, 67, 54, 0.9);
  color: white;
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  margin-top: 20px;
  font-weight: 600;
  
  @media (max-width: 768px) {
    padding: 16px;
    margin-top: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    margin-top: 12px;
    font-size: 0.9rem;
  }
`;

const UploadIcon = styled.div`
  font-size: 4.5rem;
  color: #ff6b6b;
  margin-bottom: 20px;
  animation: iconPulse 2.5s infinite cubic-bezier(.4,2,.3,1);
  
  @keyframes iconPulse {
    0% { transform: scale(1); filter: drop-shadow(0 0 0 #ff6b6b); }
    50% { transform: scale(1.12); filter: drop-shadow(0 0 16px #ff6b6b); }
    100% { transform: scale(1); filter: drop-shadow(0 0 0 #ff6b6b); }
  }
  
  @media (max-width: 768px) {
    font-size: 3.2rem;
    margin-bottom: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 2.2rem;
    margin-bottom: 12px;
  }
`;

const UploadPage = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
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

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  }, []);

  const handleFiles = async (files) => {
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB in bytes
    
    const imageFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)
    );

    if (imageFiles.length === 0) {
      alert('Please select only image files (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Check file sizes
    const oversizedFiles = imageFiles.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => f.name).join(', ');
      alert(`The following files are too large (max 20MB each): ${fileNames}`);
      return;
    }

    setIsUploading(true);
    const newUploads = imageFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      status: 'uploading',
      progress: 0,
      error: null
    }));

    setUploads(prev => [...prev, ...newUploads]);

    for (const upload of newUploads) {
      try {
        const formData = new FormData();
        formData.append('file', upload.file);

        await axios.post('http://localhost:8080/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploads(prev => prev.map(u => 
              u.id === upload.id ? { ...u, progress } : u
            ));
          }
        });

        setUploads(prev => prev.map(u => 
          u.id === upload.id ? { ...u, status: 'success', progress: 100 } : u
        ));
      } catch (error) {
        setUploads(prev => prev.map(u => 
          u.id === upload.id ? { ...u, status: 'error', error: error.message } : u
        ));
      }
    }

    setIsUploading(false);
    
    // Show success message and auto-navigate after successful uploads
    const successfulUploads = uploads.filter(u => u.status === 'success');
    if (successfulUploads.length > 0) {
      setShowSuccessMessage(true);
      sessionStorage.setItem('fromUpload', 'true'); // Mark that we're coming from upload
      setTimeout(() => {
        navigate('/gallery');
      }, 2000); // Navigate to gallery after 2 seconds
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <FaCheck />;
      case 'error':
        return <FaTimes />;
      default:
        return <FaCloudUploadAlt />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success':
        return 'Uploaded successfully!';
      case 'error':
        return 'Upload failed';
      default:
        return 'Uploading...';
    }
  };

  const togglePersonDropdown = (e) => {
    e.stopPropagation();
    setShowPersonDropdown(!showPersonDropdown);
  };

  const handleHomeClick = () => {
    setShowPersonDropdown(false);
    navigate('/');
  };

  const handleLogoutClick = () => {
    setShowPersonDropdown(false);
    onLogout();
  };

  return (
    <UploadContainer>
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
        <LeftUserInfoContainer>
          <WelcomeMessage>
            Welcome, {currentUser.username}!
          </WelcomeMessage>
        </LeftUserInfoContainer>
      )}
      
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
      <Header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Title>
            <FaHeart /> Add Photos to Our Gallery
          </Title>
          <div style={{ 
            display: 'flex', 
            gap: '10px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: '10px'
          }}>
            <NavButton
              className="primary"
              onClick={() => navigate('/upload/music')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaMusic /> Add Music
            </NavButton>
          </div>
        </div>
      </Header>

      <UploadArea
        className={isDragOver ? 'drag-over' : ''}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <UploadIcon>
          <FaCloudUploadAlt />
        </UploadIcon>
        <UploadText>Drop photos here or click to browse</UploadText>
        <UploadSubtext>JPEG, PNG, GIF, WebP • Max 20MB</UploadSubtext>
        <FileInput
          id="file-input"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
        />
      </UploadArea>

      {uploads.length > 0 && (
        <ProgressContainer>
          {uploads.map((upload) => (
            <ProgressItem
              key={upload.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProgressIcon $status={upload.status}>
                {getStatusIcon(upload.status)}
              </ProgressIcon>
              <ProgressInfo>
                <ProgressFileName>{upload.file.name}</ProgressFileName>
                <ProgressStatus>{getStatusText(upload.status)}</ProgressStatus>
                {upload.status === 'uploading' && (
                  <ProgressBar>
                    <ProgressFill
                      initial={{ width: 0 }}
                      animate={{ width: `${upload.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </ProgressBar>
                )}
                {upload.error && (
                  <ProgressStatus style={{ color: '#f44336' }}>
                    {upload.error}
                  </ProgressStatus>
                )}
              </ProgressInfo>
            </ProgressItem>
          ))}
        </ProgressContainer>
      )}

      {showSuccessMessage && (
        <SuccessMessage
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Photos uploaded successfully! Redirecting to gallery...
        </SuccessMessage>
      )}

      {uploads.some(u => u.status === 'error') && (
        <ErrorMessage
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Some uploads failed. Please try again.
        </ErrorMessage>
      )}
      
      <FooterMessage>
        Made with ❤️ by the one who loves you the most
      </FooterMessage>
    </UploadContainer>
  );
};

export default UploadPage; 