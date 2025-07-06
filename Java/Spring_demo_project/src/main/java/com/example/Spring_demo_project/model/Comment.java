package com.example.Spring_demo_project.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class Comment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "photo_name", nullable = false)
    private String photoName;
    
    @Column(name = "comment_text", nullable = false, length = 1000)
    private String commentText;
    
    @Column(name = "author_name", nullable = false)
    private String authorName;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    // Default constructor
    public Comment() {
        this.createdAt = LocalDateTime.now();
    }
    
    // Constructor with parameters
    public Comment(String photoName, String commentText, String authorName) {
        this.photoName = photoName;
        this.commentText = commentText;
        this.authorName = authorName;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getPhotoName() {
        return photoName;
    }
    
    public void setPhotoName(String photoName) {
        this.photoName = photoName;
    }
    
    public String getCommentText() {
        return commentText;
    }
    
    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }
    
    public String getAuthorName() {
        return authorName;
    }
    
    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
} 