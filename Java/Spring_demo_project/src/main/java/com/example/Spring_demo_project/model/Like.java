package com.example.Spring_demo_project.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "likes")
public class Like {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "photo_name", nullable = false)
    private String photoName;
    
    @Column(name = "user_name", nullable = false)
    private String userName;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    // Default constructor
    public Like() {
        this.createdAt = LocalDateTime.now();
    }
    
    // Constructor with parameters
    public Like(String photoName, String userName) {
        this.photoName = photoName;
        this.userName = userName;
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
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
} 