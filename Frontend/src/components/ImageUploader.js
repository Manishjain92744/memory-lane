import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';

const UploaderContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 2px dashed ${props => props.$isDragOver ? '#667eea' : '#e1e5e9'};
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }
`;

const DropZone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.$isDragOver && `
    background: rgba(102, 126, 234, 0.1);
  `}
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
  color: ${props => props.$isDragOver ? '#667eea' : '#6c757d'};
  transition: all 0.3s ease;
`;

const UploadText = styled.div`
  text-align: center;
  color: #6c757d;
  margin-bottom: 20px;
`;

const MainText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${props => props.$isDragOver ? '#667eea' : '#495057'};
`;

const SubText = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const BackButton = styled.button`
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
  margin-left: 15px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  z-index: 10;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ImageUploader = ({ 
  onImageUpload, 
  onUploadStart, 
  onUploadComplete, 
  onUploadError, 
  isLoading,
  onBackToGallery 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

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
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      onUploadError('Please select a valid image file');
    }
  }, [onUploadError]);

  const handleFileInputChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      onUploadError('Please select a file first!');
      return;
    }

    onUploadStart();

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const fileName = await response.text();
      const normalizedFileName = fileName.trim();
      
      const imageData = {
        url: `http://localhost:8080/upload/${encodeURIComponent(normalizedFileName)}`,
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type
      };

      onImageUpload(imageData);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error("Upload error:", error);
      onUploadError("Upload failed. Please try again.");
    } finally {
      onUploadComplete();
    }
  }, [selectedFile, onUploadStart, onUploadComplete, onImageUpload, onUploadError]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <UploaderContainer 
      $isDragOver={isDragOver}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isLoading && (
        <LoadingOverlay>
          <Spinner />
        </LoadingOverlay>
      )}
      
      <DropZone $isDragOver={isDragOver} onClick={handleClick}>
        <UploadIcon $isDragOver={isDragOver}>
          {isDragOver ? '📁' : '📤'}
        </UploadIcon>
        
        <UploadText>
          <MainText $isDragOver={isDragOver}>
            {isDragOver ? 'Drop your image here' : 'Upload your image'}
          </MainText>
          <SubText>
            Drag and drop an image here, or click to browse
          </SubText>
        </UploadText>
        
        <FileInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
        />
        
        {selectedFile && (
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <div style={{ fontWeight: '600', color: '#667eea' }}>
              Selected: {selectedFile.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        )}
      </DropZone>
      
      <ButtonContainer>
        <UploadButton 
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload Image'}
        </UploadButton>
        <BackButton onClick={onBackToGallery}>
          ← Back to Gallery
        </BackButton>
      </ButtonContainer>
    </UploaderContainer>
  );
};

export default ImageUploader; 