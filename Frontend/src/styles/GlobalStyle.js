import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Pacifico&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', sans-serif;
    line-height: 1.6;
    color: #333;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
    
    @media (max-width: 768px) {
      font-size: 15px;
    }
    
    @media (max-width: 480px) {
      font-size: 14px;
    }
  }

  /* Prevent zoom on input focus on iOS */
  input, textarea, select {
    font-size: 16px;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  /* Selection */
  ::selection {
    background: rgba(102, 126, 234, 0.3);
    color: white;
  }

  /* Focus styles */
  button:focus,
  input:focus,
  textarea:focus,
  select:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
  }

  /* Touch-friendly improvements */
  button, 
  input[type="button"], 
  input[type="submit"], 
  input[type="reset"],
  select {
    min-height: 44px;
    min-width: 44px;
    
    @media (max-width: 480px) {
      min-height: 48px;
      min-width: 48px;
    }
  }

  /* Loading animation */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Glass morphism effect */
  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  /* Responsive utilities */
  .mobile-only {
    display: none;
  }

  .desktop-only {
    display: block;
  }

  .tablet-only {
    display: none;
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    .tablet-only {
      display: block;
    }
  }

  @media (max-width: 768px) {
    .mobile-only {
      display: block;
    }
    
    .desktop-only {
      display: none;
    }
    
    .tablet-only {
      display: none;
    }
  }

  /* Improved text rendering */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
  }

  /* Better spacing for mobile */
  @media (max-width: 480px) {
    h1 {
      font-size: 1.8rem;
    }
    
    h2 {
      font-size: 1.5rem;
    }
    
    h3 {
      font-size: 1.3rem;
    }
  }

  /* Prevent horizontal scroll */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Better form elements on mobile */
  @media (max-width: 480px) {
    input, textarea, select {
      border-radius: 8px;
      padding: 12px 16px;
    }
  }
`;

export default GlobalStyle; 