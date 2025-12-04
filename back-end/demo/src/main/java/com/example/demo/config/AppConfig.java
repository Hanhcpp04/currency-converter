package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import io.github.cdimascio.dotenv.Dotenv;

@Configuration
public class AppConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    
    @Bean
    public String apiKey() {
        try {
            Dotenv dotenv = Dotenv.configure()
                    .ignoreIfMissing()
                    .load();
            
            String key = System.getenv("API_CURRENCY");
            if (key == null || key.isEmpty()) {
                key = dotenv.get("API_CURRENCY");
            }
            
            System.out.println("✓ Loaded API Key: " + (key != null && !key.isEmpty() ? "Success" : "Failed"));
            return key != null ? key : "";
        } catch (Exception e) {
            System.err.println("Error loading API Key: " + e.getMessage());
            String key = System.getenv("API_CURRENCY");
            return key != null ? key : "";
        }
    }
}
