import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicFiles, setMusicFiles] = useState([]);
  const [currentMusic, setCurrentMusic] = useState(null);
  const audioRef = useRef(new Audio('/romantic-music.mp3'));

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.3;
    
    fetchMusicFiles();
    
    return () => {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    };
  }, []);

  const fetchMusicFiles = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/music');
      setMusicFiles(response.data);
      // Set the first music file as current if available
      if (response.data.length > 0 && !currentMusic) {
        setCurrentMusic(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching music files:', error);
    }
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Only set src if it's different from current src or if no src is set
      if (currentMusic && audio.src !== `http://localhost:8080/api/images/${currentMusic}`) {
        audio.src = `http://localhost:8080/api/images/${currentMusic}`;
      }
      audio.play().catch(() => {
        console.log('Audio autoplay blocked');
      });
      setIsPlaying(true);
    }
  };

  const changeMusic = (musicFile) => {
    const audio = audioRef.current;
    const wasPlaying = isPlaying;
    
    if (wasPlaying) {
      audio.pause();
    }
    
    setCurrentMusic(musicFile);
    
    if (musicFile) {
      audio.src = `http://localhost:8080/api/images/${musicFile}`;
      if (wasPlaying) {
        audio.play().catch(() => {
          console.log('Audio autoplay blocked');
        });
      }
    }
  };

  const stopMusic = () => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  };

  const value = {
    isPlaying,
    musicFiles,
    currentMusic,
    toggleMusic,
    changeMusic,
    stopMusic,
    fetchMusicFiles
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}; 