package com.memorylane.Configguration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Allow all endpoints
                        .allowedOrigins("http://localhost:3000", "http://127.0.0.1:3000", "https://memory-lane-gallery.netlify.app") // Frontend ports
                        .allowedMethods("*") // GET, POST, etc.
                        .allowedHeaders("*");
            }
        };
    }
}

