package com.example.Spring_demo_project.controller;

import com.example.Spring_demo_project.model.User;
import com.example.Spring_demo_project.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User signup and login API")
@CrossOrigin(origins = {"http://localhost:3000", "https://memory-lane-gallery.netlify.app"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS}, allowedHeaders = "*")
public class UserController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/signup")
    @Operation(summary = "User Signup", description = "Register a new user")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            // Validate input
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Username is required"));
            }
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Email is required"));
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Password is required"));
            }
            if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Full name is required"));
            }

            // Create new user
            User user = new User(
                request.getUsername().trim(),
                request.getEmail().trim().toLowerCase(),
                request.getPassword(),
                request.getFullName().trim(),
                request.getProfilePicture()
            );

            User savedUser = fileStorageService.saveUser(user);
            if (savedUser != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "User registered successfully");
                response.put("user", createUserResponse(savedUser));
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(createErrorResponse("Failed to register user"));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse("An error occurred during registration"));
        }
    }

    @PostMapping("/login")
    @Operation(summary = "User Login", description = "Authenticate user and login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Validate input
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Username is required"));
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Password is required"));
            }

            // Authenticate user
            User user = fileStorageService.authenticateUser(request.getUsername().trim(), request.getPassword());
            if (user != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Login successful");
                response.put("user", createUserResponse(user));
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(createErrorResponse("Invalid username or password"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse("An error occurred during login"));
        }
    }

    @GetMapping("/check-username/{username}")
    @Operation(summary = "Check Username Availability", description = "Check if username is available")
    public ResponseEntity<?> checkUsername(@PathVariable String username) {
        try {
            User existingUser = fileStorageService.getUserByUsername(username);
            Map<String, Object> response = new HashMap<>();
            response.put("available", existingUser == null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Error checking username"));
        }
    }

    @GetMapping("/check-email/{email}")
    @Operation(summary = "Check Email Availability", description = "Check if email is available")
    public ResponseEntity<?> checkEmail(@PathVariable String email) {
        try {
            User existingUser = fileStorageService.getUserByEmail(email.toLowerCase());
            Map<String, Object> response = new HashMap<>();
            response.put("available", existingUser == null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Error checking email"));
        }
    }

    @PostMapping("/upload-profile-picture")
    @Operation(summary = "Upload Profile Picture", description = "Upload a profile picture for a user")
    public ResponseEntity<?> uploadProfilePicture(@RequestParam("file") MultipartFile file, @RequestParam("username") String username) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Please select a file to upload"));
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(createErrorResponse("Only image files are allowed"));
            }

            // Validate file size (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body(createErrorResponse("File size must be less than 5MB"));
            }

            String fileName = fileStorageService.storeProfilePicture(file, username);
            if (fileName != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Profile picture uploaded successfully");
                response.put("fileName", fileName);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(createErrorResponse("Failed to upload profile picture"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse("An error occurred during upload"));
        }
    }

    @GetMapping("/profile-pictures/{fileName}")
    @Operation(summary = "Get Profile Picture", description = "Retrieve a profile picture by filename")
    public ResponseEntity<Resource> getProfilePicture(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get("uploads/profile-pictures").resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private Map<String, Object> createUserResponse(User user) {
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", user.getId());
        userResponse.put("username", user.getUsername());
        userResponse.put("email", user.getEmail());
        userResponse.put("fullName", user.getFullName());
        userResponse.put("profilePicture", user.getProfilePicture());
        userResponse.put("createdAt", user.getCreatedAt());
        userResponse.put("lastLoginAt", user.getLastLoginAt());
        return userResponse;
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }

    // Request classes
    public static class SignupRequest {
        private String username;
        private String email;
        private String password;
        private String fullName;
        private String profilePicture;

        // Getters and Setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getProfilePicture() { return profilePicture; }
        public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
    }

    public static class LoginRequest {
        private String username;
        private String password;

        // Getters and Setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
} 