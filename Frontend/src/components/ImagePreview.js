import React from 'react';
import styled from 'styled-components';

const PreviewContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  min-height: 400px;
  display: flex;
  flex-direction: column;
`;

const PreviewTitle = styled.h2`
  margin: 0 0 20px 0;
  color: #495057;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  overflow: hidden;
  background: #f8f9fa;
  border: 2px dashed #e9ecef;
  min-height: 300px;
  position: relative;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  text-align: center;
  padding: 40px;
`;

const PlaceholderIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 15px;
  opacity: 0.5;
`;

const PlaceholderText = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

const PlaceholderSubtext = styled.div`
  font-size: 0.9rem;
  opacity: 0.7;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #667eea;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #dc3545;
  text-align: center;
  padding: 40px;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
`;

const ErrorText = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

const ErrorSubtext = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ImageInfo = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
`;

const InfoTitle = styled.div`
  font-weight: 600;
  color: #495057;
  margin-bottom: 10px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  font-size: 0.9rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
`;

const InfoLabel = styled.span`
  color: #6c757d;
  font-weight: 500;
`;

const InfoValue = styled.span`
  color: #495057;
  font-weight: 600;
`;

const ImagePreview = ({ image, isLoading, error }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatFileType = (type) => {
    return type.split('/')[1]?.toUpperCase() || 'Unknown';
  };

  if (isLoading) {
    return (
      <PreviewContainer>
        <PreviewTitle>Image Preview</PreviewTitle>
        <ImageContainer>
          <LoadingContainer>
            <Spinner />
            <div>Uploading image...</div>
          </LoadingContainer>
        </ImageContainer>
      </PreviewContainer>
    );
  }

  if (error) {
    return (
      <PreviewContainer>
        <PreviewTitle>Image Preview</PreviewTitle>
        <ImageContainer>
          <ErrorContainer>
            <ErrorIcon>⚠️</ErrorIcon>
            <ErrorText>Upload Error</ErrorText>
            <ErrorSubtext>{error}</ErrorSubtext>
          </ErrorContainer>
        </ImageContainer>
      </PreviewContainer>
    );
  }

  if (!image) {
    return (
      <PreviewContainer>
        <PreviewTitle>Image Preview</PreviewTitle>
        <ImageContainer>
          <Placeholder>
            <PlaceholderIcon>🖼️</PlaceholderIcon>
            <PlaceholderText>No image uploaded yet</PlaceholderText>
            <PlaceholderSubtext>Upload an image to see it here</PlaceholderSubtext>
          </Placeholder>
        </ImageContainer>
      </PreviewContainer>
    );
  }

  return (
    <PreviewContainer>
      <PreviewTitle>Image Preview</PreviewTitle>
      <ImageContainer>
        <PreviewImage 
          src={image.url} 
          alt={image.name}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <ErrorContainer style={{ display: 'none' }}>
          <ErrorIcon>🖼️</ErrorIcon>
          <ErrorText>Failed to load image</ErrorText>
          <ErrorSubtext>Please try uploading again</ErrorSubtext>
        </ErrorContainer>
      </ImageContainer>
      
      <ImageInfo>
        <InfoTitle>Image Information</InfoTitle>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Name:</InfoLabel>
            <InfoValue>{image.name}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Size:</InfoLabel>
            <InfoValue>{formatFileSize(image.size)}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Type:</InfoLabel>
            <InfoValue>{formatFileType(image.type)}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Dimensions:</InfoLabel>
            <InfoValue>Loading...</InfoValue>
          </InfoItem>
        </InfoGrid>
      </ImageInfo>
    </PreviewContainer>
  );
};

export default ImagePreview; 