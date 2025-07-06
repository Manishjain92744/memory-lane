package com.memorylane.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.S3Object;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import io.swagger.v3.oas.annotations.Parameter;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;
import com.memorylane.model.Comment;
import com.memorylane.model.Like;
import com.memorylane.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api")
@Tag(name = "Memory Lane Gallery", description = "Romantic photo gallery API")
@CrossOrigin(origins = {"http://localhost:3000", "https://memory-lane-gallery.netlify.app"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.OPTIONS}, allowedHeaders = "*")
public class R2UploadController {

    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;

    @Value("${cloud.aws.bucket}")
    private String bucketName;

    @Value("${cloud.aws.endpoint}")
    private String endpoint;

    @Autowired
    private FileStorageService fileStorageService;

    private S3Client getS3Client() throws URISyntaxException {
        AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);
        return S3Client.builder()
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .endpointOverride(new URI(endpoint))
                .region(Region.US_EAST_1)
                .forcePathStyle(true)
                .build();
    }

    @PostMapping("/upload")
    @Operation(summary = "Upload Photo to Gallery", description = "Uploads a photo to the romantic gallery")
    public ResponseEntity<UploadResponse> uploadFile(
            @Parameter(description = "Photo to upload", required = true) 
            @RequestParam("file") MultipartFile file) throws Exception {
        
        // Validate that it's an image file
        if (!file.getContentType().startsWith("image/")) {
            return ResponseEntity.badRequest().body(new UploadResponse(null, "Only image files are allowed for photo upload"));
        }
        
        String originalName = file.getOriginalFilename();
        String baseName = originalName
                .replaceAll("[\\s]+", "_")             // replace all whitespace with "_"
                .replaceAll("[^a-zA-Z0-9._-]", "")     // remove special characters
                .replaceAll("[^\\x00-\\x7F]", "");     // remove all non-ASCII characters
        
        // Add timestamp to prevent filename conflicts
        String timestamp = String.valueOf(System.currentTimeMillis());
        String extension = "";
        if (baseName.contains(".")) {
            extension = baseName.substring(baseName.lastIndexOf("."));
            baseName = baseName.substring(0, baseName.lastIndexOf("."));
        }
        String normalizedFileName = baseName + "_" + timestamp + extension;

        try {
            S3Client s3 = getS3Client();

            s3.putObject(PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(normalizedFileName)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromBytes(file.getBytes())
            );

            return ResponseEntity.ok(new UploadResponse(normalizedFileName, "Photo uploaded successfully!"));
        } catch (Exception e) {
            // Fallback to local storage if R2 fails
            System.err.println("R2 upload failed, using local storage: " + e.getMessage());
            
            // Create uploads directory if it doesn't exist
            java.io.File uploadsDir = new java.io.File("uploads");
            if (!uploadsDir.exists()) {
                uploadsDir.mkdirs();
            }
            
            // Save file locally
            java.io.File localFile = new java.io.File(uploadsDir, normalizedFileName);
            file.transferTo(localFile);
            
            return ResponseEntity.ok(new UploadResponse(normalizedFileName, "Photo uploaded successfully (local storage)!"));
        }
    }

    @PostMapping("/upload/music")
    @Operation(summary = "Upload Music to Gallery", description = "Uploads a music file to the romantic gallery")
    public ResponseEntity<UploadResponse> uploadMusic(
            @Parameter(description = "Music file to upload", required = true) 
            @RequestParam("file") MultipartFile file) throws Exception {
        
        // Validate that it's an audio file
        if (!file.getContentType().startsWith("audio/")) {
            return ResponseEntity.badRequest().body(new UploadResponse(null, "Only audio files are allowed for music upload"));
        }
        
        try {
            S3Client s3 = getS3Client();
            
            // Delete all existing music files before uploading new one
            ListObjectsV2Request listRequest = ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .build();
            ListObjectsV2Response listResponse = s3.listObjectsV2(listRequest);
            
            for (S3Object obj : listResponse.contents()) {
                String key = obj.key();
                if (key.matches(".*\\.(mp3|wav|m4a)$")) {
                    s3.deleteObject(builder -> builder
                            .bucket(bucketName)
                            .key(key)
                    );
                }
            }
            
            String originalName = file.getOriginalFilename();
            String baseName = originalName
                    .replaceAll("[\\s]+", "_")             // replace all whitespace with "_"
                    .replaceAll("[^a-zA-Z0-9._-]", "")     // remove special characters
                    .replaceAll("[^\\x00-\\x7F]", "");     // remove all non-ASCII characters
            
            // Add timestamp to prevent filename conflicts
            String timestamp = String.valueOf(System.currentTimeMillis());
            String extension = "";
            if (baseName.contains(".")) {
                extension = baseName.substring(baseName.lastIndexOf("."));
                baseName = baseName.substring(0, baseName.lastIndexOf("."));
            }
            String normalizedFileName = baseName + "_" + timestamp + extension;

            s3.putObject(PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(normalizedFileName)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromBytes(file.getBytes())
            );

            return ResponseEntity.ok(new UploadResponse(normalizedFileName, "Music uploaded successfully! Previous song deleted."));
        } catch (Exception e) {
            // Fallback to local storage if R2 fails
            System.err.println("R2 music upload failed, using local storage: " + e.getMessage());
            
            // Create uploads directory if it doesn't exist
            java.io.File uploadsDir = new java.io.File("uploads");
            if (!uploadsDir.exists()) {
                uploadsDir.mkdirs();
            }
            
            // Delete existing music files locally
            java.io.File[] existingFiles = uploadsDir.listFiles((dir, name) -> name.matches(".*\\.(mp3|wav|m4a)$"));
            if (existingFiles != null) {
                for (java.io.File existingFile : existingFiles) {
                    existingFile.delete();
                }
            }
            
            String originalName = file.getOriginalFilename();
            String baseName = originalName
                    .replaceAll("[\\s]+", "_")
                    .replaceAll("[^a-zA-Z0-9._-]", "")
                    .replaceAll("[^\\x00-\\x7F]", "");
            
            String timestamp = String.valueOf(System.currentTimeMillis());
            String extension = "";
            if (baseName.contains(".")) {
                extension = baseName.substring(baseName.lastIndexOf("."));
                baseName = baseName.substring(0, baseName.lastIndexOf("."));
            }
            String normalizedFileName = baseName + "_" + timestamp + extension;
            
            // Save file locally
            java.io.File localFile = new java.io.File(uploadsDir, normalizedFileName);
            file.transferTo(localFile);
            
            return ResponseEntity.ok(new UploadResponse(normalizedFileName, "Music uploaded successfully (local storage)! Previous song deleted."));
        }
    }

    @GetMapping("/images")
    @Operation(summary = "Get All Photos", description = "Returns list of all photos in the gallery")
    public ResponseEntity<List<String>> getAllImages() throws Exception {
        try {
            S3Client s3 = getS3Client();
            
            ListObjectsV2Request request = ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .build();
            
            ListObjectsV2Response response = s3.listObjectsV2(request);
            
            List<String> imageNames = response.contents().stream()
                    .map(S3Object::key)
                    .filter(key -> key.matches(".*\\.(jpg|jpeg|png|gif|webp)$"))
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(imageNames);
        } catch (Exception e) {
            // Fallback to local storage
            System.err.println("R2 list images failed, using local storage: " + e.getMessage());
            
            java.io.File uploadsDir = new java.io.File("uploads");
            if (!uploadsDir.exists()) {
                return ResponseEntity.ok(new ArrayList<>());
            }
            
            java.io.File[] files = uploadsDir.listFiles((dir, name) -> name.matches(".*\\.(jpg|jpeg|png|gif|webp)$"));
            List<String> imageNames = new ArrayList<>();
            if (files != null) {
                for (java.io.File file : files) {
                    imageNames.add(file.getName());
                }
            }
            
            return ResponseEntity.ok(imageNames);
        }
    }

    @GetMapping("/music")
    @Operation(summary = "Get Music Files", description = "Returns list of all music files")
    public ResponseEntity<List<String>> getMusicFiles() throws Exception {
        try {
            S3Client s3 = getS3Client();
            
            ListObjectsV2Request request = ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .build();
            
            ListObjectsV2Response response = s3.listObjectsV2(request);
            
            List<String> musicFiles = response.contents().stream()
                    .map(S3Object::key)
                    .filter(key -> key.matches(".*\\.(mp3|wav|m4a)$"))
                    .sorted() // Sort by filename
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(musicFiles);
        } catch (Exception e) {
            // Fallback to local storage
            System.err.println("R2 list music failed, using local storage: " + e.getMessage());
            
            java.io.File uploadsDir = new java.io.File("uploads");
            if (!uploadsDir.exists()) {
                return ResponseEntity.ok(new ArrayList<>());
            }
            
            java.io.File[] files = uploadsDir.listFiles((dir, name) -> name.matches(".*\\.(mp3|wav|m4a)$"));
            List<String> musicFiles = new ArrayList<>();
            if (files != null) {
                for (java.io.File file : files) {
                    musicFiles.add(file.getName());
                }
            }
            
            return ResponseEntity.ok(musicFiles);
        }
    }

    @DeleteMapping("/music/{fileName}")
    @Operation(summary = "Delete Music File", description = "Deletes a specific music file")
    public ResponseEntity<String> deleteMusicFile(@PathVariable String fileName) throws Exception {
        S3Client s3 = getS3Client();
        
        // Only allow deletion of music files
        if (!fileName.matches(".*\\.(mp3|wav|m4a)$")) {
            return ResponseEntity.badRequest().body("Only music files can be deleted");
        }
        
        s3.deleteObject(builder -> builder
                .bucket(bucketName)
                .key(fileName)
        );
        
        return ResponseEntity.ok("Music file deleted successfully");
    }

    @DeleteMapping("/images/{fileName}")
    @Operation(summary = "Delete Photo", description = "Deletes a specific photo from the gallery")
    public ResponseEntity<String> deleteImage(@PathVariable String fileName) throws Exception {
        S3Client s3 = getS3Client();
        
        // Only allow deletion of image files
        if (!fileName.matches(".*\\.(jpg|jpeg|png|gif|webp)$")) {
            return ResponseEntity.badRequest().body("Only image files can be deleted");
        }
        
        // Delete the image from S3
        s3.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .build());
        
        // Delete associated comments
        fileStorageService.deleteCommentsByPhotoName(fileName);
        
        // Delete associated likes
        fileStorageService.deleteLikesByPhotoName(fileName);
        
        return ResponseEntity.ok("Photo deleted successfully");
    }

    @GetMapping("/images/{fileName}")
    @Operation(summary = "Get Photo", description = "Streams a photo from the gallery")
    public ResponseEntity<byte[]> getFile(@PathVariable String fileName) throws Exception {
        try {
            S3Client s3 = getS3Client();

            var object = s3.getObject(builder -> builder
                    .bucket(bucketName)
                    .key(fileName)
            );

            byte[] content = object.readAllBytes();
            
            // Determine content type based on file extension
            String contentType = "image/jpeg"; // default
            if (fileName.toLowerCase().endsWith(".png")) {
                contentType = "image/png";
            } else if (fileName.toLowerCase().endsWith(".gif")) {
                contentType = "image/gif";
            } else if (fileName.toLowerCase().endsWith(".webp")) {
                contentType = "image/webp";
            } else if (fileName.toLowerCase().endsWith(".mp3")) {
                contentType = "audio/mpeg";
            } else if (fileName.toLowerCase().endsWith(".wav")) {
                contentType = "audio/wav";
            } else if (fileName.toLowerCase().endsWith(".m4a")) {
                contentType = "audio/mp4";
            }

            // URL encode the filename to handle special characters
            String encodedFileName = java.net.URLEncoder.encode(fileName, java.nio.charset.StandardCharsets.UTF_8);
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + encodedFileName + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(content);
        } catch (Exception e) {
            // Fallback to local storage
            System.err.println("R2 get file failed, using local storage: " + e.getMessage());
            
            java.io.File uploadsDir = new java.io.File("uploads");
            java.io.File localFile = new java.io.File(uploadsDir, fileName);
            
            if (!localFile.exists()) {
                return ResponseEntity.notFound().build();
            }
            
            byte[] content = java.nio.file.Files.readAllBytes(localFile.toPath());
            
            // Determine content type based on file extension
            String contentType = "image/jpeg"; // default
            if (fileName.toLowerCase().endsWith(".png")) {
                contentType = "image/png";
            } else if (fileName.toLowerCase().endsWith(".gif")) {
                contentType = "image/gif";
            } else if (fileName.toLowerCase().endsWith(".webp")) {
                contentType = "image/webp";
            } else if (fileName.toLowerCase().endsWith(".mp3")) {
                contentType = "audio/mpeg";
            } else if (fileName.toLowerCase().endsWith(".wav")) {
                contentType = "audio/wav";
            } else if (fileName.toLowerCase().endsWith(".m4a")) {
                contentType = "audio/mp4";
            }

            // URL encode the filename to handle special characters
            String encodedFileName = java.net.URLEncoder.encode(fileName, java.nio.charset.StandardCharsets.UTF_8);
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + encodedFileName + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(content);
        }
    }

    // Response class for upload endpoint
    public static class UploadResponse {
        private String fileName;
        private String message;

        public UploadResponse(String fileName, String message) {
            this.fileName = fileName;
            this.message = message;
        }

        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    // Comment and Like endpoints
    @PostMapping("/comments")
    @Operation(summary = "Add Comment", description = "Adds a comment to a photo")
    public ResponseEntity<Comment> addComment(@org.springframework.web.bind.annotation.RequestBody CommentRequest request) {
        Comment comment = new Comment(request.getPhotoName(), request.getCommentText(), request.getAuthorName());
        Comment savedComment = fileStorageService.saveComment(comment);
        return ResponseEntity.ok(savedComment);
    }

    @GetMapping("/comments/{photoName}")
    @Operation(summary = "Get Comments", description = "Gets all comments for a photo")
    public ResponseEntity<List<Comment>> getComments(@PathVariable String photoName) {
        List<Comment> comments = fileStorageService.getCommentsByPhotoName(photoName);
        return ResponseEntity.ok(comments);
    }

    @DeleteMapping("/comments/{commentId}")
    @Operation(summary = "Delete Comment", description = "Deletes a specific comment")
    public ResponseEntity<String> deleteComment(@PathVariable Long commentId) {
        try {
            fileStorageService.deleteComment(commentId);
            return ResponseEntity.ok("Comment deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting comment: " + e.getMessage());
        }
    }

    @PostMapping("/likes")
    @Operation(summary = "Toggle Like", description = "Toggles like for a photo")
    public ResponseEntity<LikeResponse> toggleLike(@org.springframework.web.bind.annotation.RequestBody LikeRequest request) {
        boolean hasLiked = fileStorageService.hasUserLikedPhoto(request.getPhotoName(), request.getUserName());
        
        if (hasLiked) {
            // Unlike
            fileStorageService.deleteLike(request.getPhotoName(), request.getUserName());
            long likeCount = fileStorageService.getLikesByPhotoName(request.getPhotoName()).size();
            return ResponseEntity.ok(new LikeResponse(false, likeCount));
        } else {
            // Like
            Like like = new Like(request.getPhotoName(), request.getUserName());
            fileStorageService.saveLike(like);
            long likeCount = fileStorageService.getLikesByPhotoName(request.getPhotoName()).size();
            return ResponseEntity.ok(new LikeResponse(true, likeCount));
        }
    }

    @GetMapping("/likes/{photoName}")
    @Operation(summary = "Get Like Count", description = "Gets like count for a photo")
    public ResponseEntity<Long> getLikeCount(@PathVariable String photoName) {
        long likeCount = fileStorageService.getLikesByPhotoName(photoName).size();
        return ResponseEntity.ok(likeCount);
    }

    @GetMapping("/likes/{photoName}/user/{userName}")
    @Operation(summary = "Check User Like", description = "Checks if user has liked a photo")
    public ResponseEntity<Boolean> hasUserLiked(@PathVariable String photoName, @PathVariable String userName) {
        boolean hasLiked = fileStorageService.hasUserLikedPhoto(photoName, userName);
        return ResponseEntity.ok(hasLiked);
    }

    // Request/Response classes
    public static class CommentRequest {
        private String photoName;
        private String commentText;
        private String authorName;

        public String getPhotoName() { return photoName; }
        public void setPhotoName(String photoName) { this.photoName = photoName; }
        public String getCommentText() { return commentText; }
        public void setCommentText(String commentText) { this.commentText = commentText; }
        public String getAuthorName() { return authorName; }
        public void setAuthorName(String authorName) { this.authorName = authorName; }
    }

    public static class LikeRequest {
        private String photoName;
        private String userName;

        public String getPhotoName() { return photoName; }
        public void setPhotoName(String photoName) { this.photoName = photoName; }
        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
    }

    public static class LikeResponse {
        private boolean liked;
        private long likeCount;

        public LikeResponse(boolean liked, long likeCount) {
            this.liked = liked;
            this.likeCount = likeCount;
        }

        public boolean isLiked() { return liked; }
        public void setLiked(boolean liked) { this.liked = liked; }
        public long getLikeCount() { return likeCount; }
        public void setLikeCount(long likeCount) { this.likeCount = likeCount; }
    }
}
