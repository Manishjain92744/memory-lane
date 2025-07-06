import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaHeart, FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';
import axios from 'axios';

const LoginContainer = styled.div`
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

const LoginCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
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

const LoginButton = styled(motion.button)`
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

const SignupLink = styled.div`
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

const Login = ({ onLoginSuccess, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', formData);
      
      if (response.data.success) {
        setSuccess('Login successful!');
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // Call the parent callback
        if (onLoginSuccess) {
          onLoginSuccess(response.data.user);
        }
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
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
      
      <LoginCard
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
        
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to continue to your photo gallery</Subtitle>

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
          </InputGroup>

          <LoginButton
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </LoginButton>
        </Form>

        <SignupLink>
          Don't have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToSignup(); }}>
            Sign up here
          </a>
        </SignupLink>
      </LoginCard>
      
      <FooterMessage>
        Made with ❤️ by the one who loves you the most
      </FooterMessage>
    </LoginContainer>
  );
};

export default Login; 