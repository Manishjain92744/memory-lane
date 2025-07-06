package com.example.Spring_demo_project.Repo;

import com.example.Spring_demo_project.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    List<Comment> findByPhotoNameOrderByCreatedAtDesc(String photoName);
    
    void deleteByPhotoName(String photoName);
} 