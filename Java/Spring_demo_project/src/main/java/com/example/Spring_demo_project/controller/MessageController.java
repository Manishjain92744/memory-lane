package com.example.Spring_demo_project.controller;

import com.example.Spring_demo_project.model.Message;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    private static final String MESSAGES_FILE = "data/messages.json";
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public MessageController() {
        objectMapper.registerModule(new JavaTimeModule());
    }

    @GetMapping
    public ResponseEntity<List<Message>> getAllMessages() {
        try {
            File file = new File(MESSAGES_FILE);
            if (!file.exists()) {
                return ResponseEntity.ok(new ArrayList<>());
            }
            
            List<Message> messages = objectMapper.readValue(file, new TypeReference<List<Message>>() {});
            return ResponseEntity.ok(messages);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<Message> getLatestMessage() {
        try {
            File file = new File(MESSAGES_FILE);
            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }
            
            List<Message> messages = objectMapper.readValue(file, new TypeReference<List<Message>>() {});
            if (messages.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Return the latest message (last in the list)
            Message latestMessage = messages.get(messages.size() - 1);
            return ResponseEntity.ok(latestMessage);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<Message> createMessage(@RequestBody Message message) {
        try {
            File file = new File(MESSAGES_FILE);
            List<Message> messages = new ArrayList<>();
            
            if (file.exists()) {
                messages = objectMapper.readValue(file, new TypeReference<List<Message>>() {});
            }
            
            // Set ID and timestamp
            message.setId(System.currentTimeMillis());
            message.setTimestamp(LocalDateTime.now());
            
            messages.add(message);
            
            // Ensure directory exists
            file.getParentFile().mkdirs();
            
            // Write to file
            objectMapper.writeValue(file, messages);
            
            return ResponseEntity.ok(message);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
} 