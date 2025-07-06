import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaHeart, FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope, FaUserCircle, FaCamera, FaUpload } from 'react-icons/fa';
import axios from 'axios';

const SignupContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
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

const SignupCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  font-size: 2rem;
  margin-bottom: 10px;
  font-weight: 600;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 20px 15px 50px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 1.2rem;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1.2rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #667eea;
  }
`;

const SignupButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #666;
  
  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;
    
    &:hover {
      color: #764ba2;
    }
  }
`;

const ErrorMessage = styled(motion.div)`
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid #fcc;
`;

const SuccessMessage = styled(motion.div)`
  background: #efe;
  color: #3c3;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid #cfc;
`;

const HeartIcon = styled(motion.div)`
  text-align: center;
  font-size: 2rem;
  color: #e74c3c;
  margin-bottom: 20px;
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

const PasswordStrength = styled.div`
  margin-top: 5px;
  font-size: 0.8rem;
  color: ${props => {
    if (props.strength === 'weak') return '#e74c3c';
    if (props.strength === 'medium') return '#f39c12';
    if (props.strength === 'strong') return '#27ae60';
    return '#999';
  }};
`;

const ProfilePictureSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
`;

const ProfilePicturePreview = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.imageUrl ? `url(${props.imageUrl})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const ProfilePictureIcon = styled.div`
  color: white;
  font-size: 2rem;
  z-index: 1;
`;

const ProfilePictureInput = styled.input`
  display: none;
`;

const ProfilePictureLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(102, 126, 234, 0.1);
  border: 2px dashed #667eea;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #667eea;
  font-weight: 500;
  
  &:hover {
    background: rgba(102, 126, 234, 0.2);
    transform: translateY(-2px);
  }
`;

const ProfilePictureText = styled.span`
  font-size: 0.9rem;
`;

const RemovePictureButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #c0392b;
    transform: translateY(-1px);
  }
`;

const Signup = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

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

  const getPasswordStrength = (password) => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'weak';
    if (password.length < 8) return 'medium';
    return 'strong';
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview(null);
    if (document.getElementById('profile-picture-input')) {
      document.getElementById('profile-picture-input').value = '';
    }
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let profilePictureFileName = null;
      
      // Upload profile picture if selected
      if (profilePicture) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', profilePicture);
        uploadFormData.append('username', formData.username);
        
        const uploadResponse = await axios.post('http://localhost:8080/api/auth/upload-profile-picture', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (uploadResponse.data.success) {
          profilePictureFileName = uploadResponse.data.fileName;
        } else {
          setError('Failed to upload profile picture');
          setLoading(false);
          return;
        }
      }

      const signupData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        profilePicture: profilePictureFileName
      };

      const response = await axios.post('http://localhost:8080/api/auth/signup', signupData);
      
      if (response.data.success) {
        setSuccess('Account created successfully! You can now log in.');
        // Clear form
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          fullName: ''
        });
        setProfilePicture(null);
        setProfilePicturePreview(null);
        // Call the parent callback
        if (onSignupSuccess) {
          onSignupSuccess(response.data.user);
        }
      } else {
        setError(response.data.message || 'Signup failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignupContainer>
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
      
      <SignupCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeartIcon
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FaHeart />
        </HeartIcon>
        
        <Title>Create Account</Title>
        <Subtitle>Join us and start sharing your memories</Subtitle>

        <ProfilePictureSection>
          <ProfilePicturePreview
            imageUrl={profilePicturePreview}
            onClick={() => document.getElementById('profile-picture-input').click()}
          >
            {!profilePicturePreview && <ProfilePictureIcon><FaCamera /></ProfilePictureIcon>}
          </ProfilePicturePreview>
          
          <ProfilePictureInput
            id="profile-picture-input"
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
          />
          
          <ProfilePictureLabel htmlFor="profile-picture-input">
            <FaUpload />
            <ProfilePictureText>
              {profilePicture ? 'Change Profile Picture' : 'Upload Profile Picture'}
            </ProfilePictureText>
          </ProfilePictureLabel>
          
          {profilePicture && (
            <RemovePictureButton onClick={removeProfilePicture}>
              Remove Picture
            </RemovePictureButton>
          )}
        </ProfilePictureSection>

        <Form onSubmit={handleSubmit}>
          {error && (
            <ErrorMessage
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </ErrorMessage>
          )}
          
          {success && (
            <SuccessMessage
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {success}
            </SuccessMessage>
          )}

          <InputGroup>
            <IconWrapper>
              <FaUserCircle />
            </IconWrapper>
            <Input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <IconWrapper>
              <FaUser />
            </IconWrapper>
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <IconWrapper>
              <FaEnvelope />
            </IconWrapper>
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <IconWrapper>
              <FaLock />
            </IconWrapper>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
            {formData.password && (
              <PasswordStrength strength={getPasswordStrength(formData.password)}>
                Password strength: {getPasswordStrength(formData.password)}
              </PasswordStrength>
            )}
          </InputGroup>

          <InputGroup>
            <IconWrapper>
              <FaLock />
            </IconWrapper>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
          </InputGroup>

          <SignupButton
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </SignupButton>
        </Form>

        <LoginLink>
          Already have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>
            Sign in here
          </a>
        </LoginLink>
      </SignupCard>
      
      <FooterMessage>
        Made with ❤️ by the one who loves you the most
      </FooterMessage>
    </SignupContainer>
  );
};

export default Signup; 