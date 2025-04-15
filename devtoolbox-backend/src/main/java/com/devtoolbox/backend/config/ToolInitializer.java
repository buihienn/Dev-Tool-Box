package com.devtoolbox.backend.config;

import com.devtoolbox.backend.data.entities.Tool;
import com.devtoolbox.backend.data.entities.Tool.Level;
import com.devtoolbox.backend.data.repositories.CategoryRepository;
import com.devtoolbox.backend.data.repositories.ToolRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.util.List;

@Configuration
@Order(2) // Đảm bảo rằng ToolInitializer được thực thi sau CategoryInitializer
public class ToolInitializer {

    @Bean
    public CommandLineRunner initializeTools(ToolRepository toolRepository, CategoryRepository categoryRepository) {
        return args -> {
            // Danh sách các tool cần khởi tạo
            List<Tool> tools = List.of(
                new Tool("token", "Token generator", true, Level.REGULAR, categoryRepository.findById("crypto").orElse(null)),
                new Tool("hash", "Hash text", true, Level.REGULAR, categoryRepository.findById("crypto").orElse(null)),
                new Tool("bcrypt", "Bcrypt", true, Level.REGULAR, categoryRepository.findById("crypto").orElse(null)),
                new Tool("math", "Math Evaluator", true, Level.REGULAR, categoryRepository.findById("math").orElse(null)),
                new Tool("eta-calculator", "ETA Calculator", true, Level.REGULAR, categoryRepository.findById("math").orElse(null)),
                new Tool("percentage-calculator", "Percentage Calculator", true, Level.REGULAR, categoryRepository.findById("math").orElse(null)),
                new Tool("ulid", "ULID Generator", true, Level.REGULAR, categoryRepository.findById("crypto").orElse(null)),
                new Tool("base-converter", "Base Converter", true, Level.REGULAR, categoryRepository.findById("converter").orElse(null)),
                new Tool("text-to-nato-alphabet", "Text to NATO Alphabet", true, Level.REGULAR, categoryRepository.findById("converter").orElse(null)),
                new Tool("xml-to-json", "XML to JSON", true, Level.REGULAR, categoryRepository.findById("converter").orElse(null)),
                new Tool("url-parser", "URL Parser", true, Level.REGULAR, categoryRepository.findById("web").orElse(null)),
                new Tool("url-formatter", "URL Formatter", true, Level.REGULAR, categoryRepository.findById("web").orElse(null)),
                new Tool("jwt-parser", "JWT Parser", true, Level.REGULAR, categoryRepository.findById("web").orElse(null)),
                new Tool("chronometer", "Chronometer", true, Level.REGULAR, categoryRepository.findById("measurement").orElse(null)),
                new Tool("qr-code", "QR Code Generator", true, Level.REGULAR, categoryRepository.findById("images_videos").orElse(null)),
                new Tool("wifi-qr-code", "WiFi QR Code Generator", true, Level.REGULAR, categoryRepository.findById("images_videos").orElse(null)),
                new Tool("image-to-base64", "Image to Base64", true, Level.REGULAR, categoryRepository.findById("images_videos").orElse(null)),
                new Tool("json-formatter", "JSON Formatter", true, Level.REGULAR, categoryRepository.findById("development").orElse(null)),
                new Tool("json-to-csv", "JSON to CSV", true, Level.REGULAR, categoryRepository.findById("development").orElse(null)),
                new Tool("docker-compose-converter", "Docker Compose Converter", true, Level.REGULAR, categoryRepository.findById("development").orElse(null)),
                new Tool("nato-converter", "NATO Converter", true, Level.REGULAR, categoryRepository.findById("converter").orElse(null))
            );

            // Lưu các tool nếu chưa tồn tại
            for (Tool tool : tools) {
                if (!toolRepository.existsById(tool.getId())) { // Sử dụng trực tiếp tool.getId()
                    toolRepository.save(tool);
                }
            }
        };
    }
}