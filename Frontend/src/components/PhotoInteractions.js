import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaComment, FaTimes, FaPaperPlane, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import axios from 'axios';

const InteractionsContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 20px;
  color: white;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  
  ${({ show }) => show && `
    transform: translateY(0);
  `}
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const CommentsContainer = styled(motion.div)`
  position: relative;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  margin-top: 8px;
  padding: 15px;
  color: white;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  
  @media (max-width: 768px) {
    padding: 12px;
    margin-top: 6px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    margin-top: 5px;
  }
`;

const CommentsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 480px) {
    margin-bottom: 10px;
    padding-bottom: 6px;
  }
`;

const CommentsTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #ffd700;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const CollapseButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

const InteractionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    gap: 12px;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    gap: 10px;
    margin-bottom: 10px;
  }
`;

const InteractionButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  min-height: 36px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &.liked {
    background: #e74c3c;
    color: white;
  }
  
  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 1rem;
    gap: 6px;
    min-height: 40px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 1.1rem;
    gap: 8px;
    min-height: 44px;
    flex: 1;
    justify-content: center;
  }
`;

const LikeCount = styled.span`
  font-size: 0.8rem;
  opacity: 0.8;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const CommentsSection = styled.div`
  max-height: 180px;
  overflow-y: auto;
  margin-bottom: 15px;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
  
  @media (max-width: 768px) {
    max-height: 140px;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    max-height: 120px;
    margin-bottom: 10px;
  }
`;

const CommentItem = styled.div`
  background: rgba(255, 255, 255, 0.08);
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 6px;
  backdrop-filter: blur(10px);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover .delete-button {
    opacity: 1;
  }
  
  @media (max-width: 480px) {
    padding: 10px 12px;
    margin-bottom: 8px;
  }
`;

const CommentAuthor = styled.div`
  font-weight: 600;
  font-size: 0.75rem;
  margin-bottom: 2px;
  color: #ffd700;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 3px;
  }
`;

const CommentText = styled.div`
  font-size: 0.85rem;
  line-height: 1.3;
  word-wrap: break-word;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const CommentTime = styled.div`
  font-size: 0.65rem;
  opacity: 0.6;
  margin-top: 3px;
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
    margin-top: 4px;
  }
`;

const DeleteButton = styled(motion.button)`
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  opacity: 0;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(231, 76, 60, 0.3);
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    opacity: 1;
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
    top: 6px;
    right: 6px;
  }
`;

const CommentForm = styled.form`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 10px;
  
  @media (max-width: 768px) {
    gap: 6px;
    margin-top: 8px;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    margin-top: 10px;
    flex-direction: column;
  }
`;

const CommentInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
  padding: 10px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
  min-width: 180px;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
    font-size: 16px; /* Prevents zoom on iOS */
    padding: 12px 16px;
  }
  
  @media (max-width: 480px) {
    padding: 14px 16px;
    font-size: 1rem;
    width: 100%;
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  color: white;
  padding: 10px 14px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 3px 12px rgba(102, 126, 234, 0.3);
  
  &:hover {
    background: linear-gradient(45deg, #5a6fd8, #6a4190);
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  @media (max-width: 768px) {
    width: auto;
    justify-content: center;
    padding: 12px 16px;
  }
  
  @media (max-width: 480px) {
    padding: 14px 16px;
    font-size: 1rem;
    gap: 6px;
    width: 100%;
    justify-content: center;
  }
`;

const SuccessMessage = styled(motion.div)`
  background: #27ae60;
  color: white;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 0.8rem;
  text-align: center;
  margin-bottom: 10px;
  backdrop-filter: blur(10px);
`;

const PhotoInteractions = ({ photoName, show }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [autoCollapseTimer, setAutoCollapseTimer] = useState(null);

  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  };

  const currentUser = getCurrentUser();
  const userName = currentUser ? currentUser.username : 'Anonymous';

  useEffect(() => {
    if (photoName) {
      fetchLikeStatus();
      fetchLikeCount();
      fetchComments();
    }
  }, [photoName]);

  // Clear auto-collapse timer when component unmounts or showComments changes
  useEffect(() => {
    return () => {
      if (autoCollapseTimer) {
        clearTimeout(autoCollapseTimer);
      }
    };
  }, [autoCollapseTimer]);

  const fetchLikeStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/likes/${photoName}/user/${userName}`);
      setLiked(response.data);
    } catch (error) {
      console.error('Error fetching like status:', error);
    }
  };

  const fetchLikeCount = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/likes/${photoName}`);
      setLikeCount(response.data);
    } catch (error) {
      console.error('Error fetching like count:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/comments/${photoName}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/likes', {
        photoName: photoName,
        userName: userName
      });
      setLiked(response.data.liked);
      setLikeCount(response.data.likeCount);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    console.log('Submitting comment:', { photoName, commentText: newComment });
    
    if (!newComment.trim()) {
      console.log('Comment is empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const commentData = {
        photoName: photoName,
        commentText: newComment.trim(),
        authorName: userName
      };
      
      console.log('Sending comment data:', commentData);
      
      const response = await axios.post('http://localhost:8080/api/comments', commentData);
      
      console.log('Comment submitted successfully:', response.data);
      
      setComments([response.data, ...comments]);
      setNewComment('');
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Clear existing timer
      if (autoCollapseTimer) {
        clearTimeout(autoCollapseTimer);
      }
      
      // Auto-collapse comment box after 3 seconds
      const timer = setTimeout(() => {
        setShowComments(false);
      }, 3000);
      setAutoCollapseTimer(timer);
    } catch (error) {
      console.error('Error adding comment:', error);
      console.error('Error details:', error.response?.data);
      alert('Failed to submit comment. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/comments/${commentId}`);
      setComments(comments.filter(comment => comment.id !== commentId));
      console.log('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const handleToggleComments = () => {
    // Clear auto-collapse timer when manually toggling
    if (autoCollapseTimer) {
      clearTimeout(autoCollapseTimer);
      setAutoCollapseTimer(null);
    }
    setShowComments(!showComments);
  };

  const handleCollapseComments = () => {
    // Clear auto-collapse timer
    if (autoCollapseTimer) {
      clearTimeout(autoCollapseTimer);
      setAutoCollapseTimer(null);
    }
    setShowComments(false);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <InteractionsContainer show={show}>
        <InteractionButtons>
          <InteractionButton
            onClick={handleLike}
            className={liked ? 'liked' : ''}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaHeart style={{ color: liked ? '#fff' : '#e74c3c' }} />
            <span>Like</span>
            {likeCount > 0 && <LikeCount>({likeCount})</LikeCount>}
          </InteractionButton>
          
          <InteractionButton
            onClick={handleToggleComments}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaComment />
            <span>Comment</span>
            {comments.length > 0 && <LikeCount>({comments.length})</LikeCount>}
          </InteractionButton>
        </InteractionButtons>
      </InteractionsContainer>

      <AnimatePresence>
        {showComments && (
          <CommentsContainer
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <CommentsHeader>
              <CommentsTitle>
                Comments ({comments.length})
              </CommentsTitle>
              <CollapseButton
                onClick={handleCollapseComments}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Collapse comments"
              >
                <FaChevronUp />
              </CollapseButton>
            </CommentsHeader>

            <CommentsSection>
              {comments.map((comment) => (
                <CommentItem key={comment.id}>
                  <DeleteButton
                    className="delete-button"
                    onClick={() => handleDeleteComment(comment.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete comment"
                  >
                    <FaTrash />
                  </DeleteButton>
                  <CommentAuthor>{comment.authorName}</CommentAuthor>
                  <CommentText>{comment.commentText}</CommentText>
                  <CommentTime>{formatTime(comment.createdAt)}</CommentTime>
                </CommentItem>
              ))}
              {comments.length === 0 && (
                <div style={{ textAlign: 'center', opacity: 0.7, fontStyle: 'italic' }}>
                  No comments yet. Be the first to comment! 💕
                </div>
              )}
            </CommentsSection>

            {showSuccess && (
              <SuccessMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                💕 Comment added successfully!
              </SuccessMessage>
            )}
            
            <CommentForm onSubmit={handleComment}>
              <CommentInput
                type="text"
                placeholder="Write a romantic comment... 💕"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
              <SubmitButton
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ⏳
                  </motion.div>
                ) : (
                  <FaPaperPlane />
                )}
              </SubmitButton>
            </CommentForm>
          </CommentsContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default PhotoInteractions; 