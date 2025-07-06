package com.memorylane.service;

import com.memorylane.model.Comment;
import com.memorylane.model.Like;
import com.memorylane.model.User;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class FileStorageService {
    
    private static final String COMMENTS_FILE = "data/comments.json";
    private static final String LIKES_FILE = "data/likes.json";
    private static final String USERS_FILE = "data/users.json";
    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    private final AtomicLong commentIdCounter = new AtomicLong(1);
    private final AtomicLong likeIdCounter = new AtomicLong(1);
    private final AtomicLong userIdCounter = new AtomicLong(1);
    
    public FileStorageService() {
        // Create data directory if it doesn't exist
        try {
            Files.createDirectories(Paths.get("data"));
        } catch (IOException e) {
            System.err.println("Error creating data directory: " + e.getMessage());
        }
        
        // Initialize files if they don't exist
        initializeFiles();
    }
    
    private void initializeFiles() {
        try {
            if (!Files.exists(Paths.get(COMMENTS_FILE))) {
                Files.write(Paths.get(COMMENTS_FILE), "[]".getBytes());
            }
            if (!Files.exists(Paths.get(LIKES_FILE))) {
                Files.write(Paths.get(LIKES_FILE), "[]".getBytes());
            }
            if (!Files.exists(Paths.get(USERS_FILE))) {
                Files.write(Paths.get(USERS_FILE), "[]".getBytes());
            }
        } catch (IOException e) {
            System.err.println("Error initializing files: " + e.getMessage());
        }
    }
    
    // Comment operations
    public List<Comment> getAllComments() {
        try {
            String content = Files.readString(Paths.get(COMMENTS_FILE));
            return objectMapper.readValue(content, new TypeReference<List<Comment>>() {});
        } catch (IOException e) {
            System.err.println("Error reading comments: " + e.getMessage());
            return new ArrayList<>();
        }
    }
    
    public List<Comment> getCommentsByPhotoName(String photoName) {
        List<Comment> allComments = getAllComments();
        return allComments.stream()
                .filter(comment -> comment.getPhotoName().equals(photoName))
                .toList();
    }
    
    public Comment saveComment(Comment comment) {
        try {
            List<Comment> comments = getAllComments();
            comment.setId(commentIdCounter.getAndIncrement());
            comment.setCreatedAt(LocalDateTime.now());
            comments.add(comment);
            
            String json = objectMapper.writeValueAsString(comments);
            Files.write(Paths.get(COMMENTS_FILE), json.getBytes());
            
            return comment;
        } catch (IOException e) {
            System.err.println("Error saving comment: " + e.getMessage());
            return null;
        }
    }
    
    public void deleteComment(Long commentId) {
        try {
            List<Comment> comments = getAllComments();
            comments.removeIf(comment -> comment.getId().equals(commentId));
            
            String json = objectMapper.writeValueAsString(comments);
            Files.write(Paths.get(COMMENTS_FILE), json.getBytes());
        } catch (IOException e) {
            System.err.println("Error deleting comment: " + e.getMessage());
        }
    }
    
    public void deleteCommentsByPhotoName(String photoName) {
        try {
            List<Comment> comments = getAllComments();
            comments.removeIf(comment -> comment.getPhotoName().equals(photoName));
            
            String json = objectMapper.writeValueAsString(comments);
            Files.write(Paths.get(COMMENTS_FILE), json.getBytes());
        } catch (IOException e) {
            System.err.println("Error deleting comments for photo: " + e.getMessage());
        }
    }
    
    // Like operations
    public List<Like> getAllLikes() {
        try {
            String content = Files.readString(Paths.get(LIKES_FILE));
            return objectMapper.readValue(content, new TypeReference<List<Like>>() {});
        } catch (IOException e) {
            System.err.println("Error reading likes: " + e.getMessage());
            return new ArrayList<>();
        }
    }
    
    public List<Like> getLikesByPhotoName(String photoName) {
        List<Like> allLikes = getAllLikes();
        return allLikes.stream()
                .filter(like -> like.getPhotoName().equals(photoName))
                .toList();
    }
    
    public boolean hasUserLikedPhoto(String photoName, String userName) {
        List<Like> likes = getLikesByPhotoName(photoName);
        return likes.stream().anyMatch(like -> like.getUserName().equals(userName));
    }
    
    public Like saveLike(Like like) {
        try {
            List<Like> likes = getAllLikes();
            like.setId(likeIdCounter.getAndIncrement());
            like.setCreatedAt(LocalDateTime.now());
            likes.add(like);
            
            String json = objectMapper.writeValueAsString(likes);
            Files.write(Paths.get(LIKES_FILE), json.getBytes());
            
            return like;
        } catch (IOException e) {
            System.err.println("Error saving like: " + e.getMessage());
            return null;
        }
    }
    
    public void deleteLike(String photoName, String userName) {
        try {
            List<Like> likes = getAllLikes();
            likes.removeIf(like -> like.getPhotoName().equals(photoName) && like.getUserName().equals(userName));
            
            String json = objectMapper.writeValueAsString(likes);
            Files.write(Paths.get(LIKES_FILE), json.getBytes());
        } catch (IOException e) {
            System.err.println("Error deleting like: " + e.getMessage());
        }
    }
    
    public void deleteLikesByPhotoName(String photoName) {
        try {
            List<Like> likes = getAllLikes();
            likes.removeIf(like -> like.getPhotoName().equals(photoName));
            
            String json = objectMapper.writeValueAsString(likes);
            Files.write(Paths.get(LIKES_FILE), json.getBytes());
        } catch (IOException e) {
            System.err.println("Error deleting likes for photo: " + e.getMessage());
        }
    }
    
    // User operations
    public List<User> getAllUsers() {
        try {
            String content = Files.readString(Paths.get(USERS_FILE));
            return objectMapper.readValue(content, new TypeReference<List<User>>() {});
        } catch (IOException e) {
            System.err.println("Error reading users: " + e.getMessage());
            return new ArrayList<>();
        }
    }
    
    public User getUserByUsername(String username) {
        List<User> users = getAllUsers();
        return users.stream()
                .filter(user -> user.getUsername().equals(username))
                .findFirst()
                .orElse(null);
    }
    
    public User getUserByEmail(String email) {
        List<User> users = getAllUsers();
        return users.stream()
                .filter(user -> user.getEmail().equals(email))
                .findFirst()
                .orElse(null);
    }
    
    public User saveUser(User user) {
        try {
            List<User> users = getAllUsers();
            
            // Check if username already exists
            if (users.stream().anyMatch(u -> u.getUsername().equals(user.getUsername()))) {
                throw new RuntimeException("Username already exists");
            }
            
            // Check if email already exists
            if (users.stream().anyMatch(u -> u.getEmail().equals(user.getEmail()))) {
                throw new RuntimeException("Email already exists");
            }
            
            user.setId(userIdCounter.getAndIncrement());
            user.setCreatedAt(LocalDateTime.now());
            users.add(user);
            
            String json = objectMapper.writeValueAsString(users);
            Files.write(Paths.get(USERS_FILE), json.getBytes());
            
            return user;
        } catch (IOException e) {
            System.err.println("Error saving user: " + e.getMessage());
            return null;
        }
    }
    
    public User authenticateUser(String username, String password) {
        User user = getUserByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            // Update last login time
            user.setLastLoginAt(LocalDateTime.now());
            updateUser(user);
            return user;
        }
        return null;
    }
    
    public void updateUser(User user) {
        try {
            List<User> users = getAllUsers();
            for (int i = 0; i < users.size(); i++) {
                if (users.get(i).getId().equals(user.getId())) {
                    users.set(i, user);
                    break;
                }
            }
            
            String json = objectMapper.writeValueAsString(users);
            Files.write(Paths.get(USERS_FILE), json.getBytes());
        } catch (IOException e) {
            System.err.println("Error updating user: " + e.getMessage());
        }
    }
    
    public void deleteUser(Long userId) {
        try {
            List<User> users = getAllUsers();
            users.removeIf(user -> user.getId().equals(userId));
            
            String json = objectMapper.writeValueAsString(users);
            Files.write(Paths.get(USERS_FILE), json.getBytes());
        } catch (IOException e) {
            System.err.println("Error deleting user: " + e.getMessage());
        }
    }
    
    // Profile picture operations
    public String storeProfilePicture(MultipartFile file, String username) {
        try {
            // Create profile pictures directory if it doesn't exist
            String uploadDir = "uploads/profile-pictures";
            Files.createDirectories(Paths.get(uploadDir));
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String fileName = username + "_profile" + fileExtension;
            String filePath = uploadDir + "/" + fileName;
            
            // Save the file
            Files.write(Paths.get(filePath), file.getBytes());
            
            return fileName;
        } catch (IOException e) {
            System.err.println("Error storing profile picture: " + e.getMessage());
            return null;
        }
    }
} 