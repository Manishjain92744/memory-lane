package com.memorylane.Repo;

import com.memorylane.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    
    List<Like> findByPhotoName(String photoName);
    
    Optional<Like> findByPhotoNameAndUserName(String photoName, String userName);
    
    void deleteByPhotoName(String photoName);
    
    long countByPhotoName(String photoName);
} 