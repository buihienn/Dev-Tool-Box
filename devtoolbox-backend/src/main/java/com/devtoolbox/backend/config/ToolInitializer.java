package com.devtoolbox.backend.config;

import com.devtoolbox.backend.data.entities.Tool;
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
                new Tool("token", "Token generator", true, false, false, categoryRepository.findById("crypto").orElse(null)),
                new Tool("hash", "Hash text", true, false, false, categoryRepository.findById("crypto").orElse(null)),
                new Tool("bcrypt", "Bcrypt", true, false, false, categoryRepository.findById("crypto").orElse(null)),
                new Tool("math", "Math Evaluator", true, false, false, categoryRepository.findById("math").orElse(null)),
                new Tool("eta-calculator", "ETA Calculator", true, false, false, categoryRepository.findById("math").orElse(null)),
                new Tool("percentage-calculator", "Percentage Calculator", true, false, false, categoryRepository.findById("math").orElse(null)),
                new Tool("ulid", "ULID Generator", true, false, false, categoryRepository.findById("crypto").orElse(null)),
                new Tool("base-converter", "Base Converter", true, false, false, categoryRepository.findById("converter").orElse(null)),
                new Tool("text-to-nato-alphabet", "Text to NATO Alphabet", true, false, false, categoryRepository.findById("converter").orElse(null)),
                new Tool("xml-to-json", "XML to JSON", true, false, false, categoryRepository.findById("converter").orElse(null)),
                new Tool("url-parser", "URL Parser", true, false, false, categoryRepository.findById("web").orElse(null)),
                new Tool("url-formatter", "URL Formatter", true, false, false, categoryRepository.findById("web").orElse(null)),
                new Tool("jwt-parser", "JWT Parser", true, false, false, categoryRepository.findById("web").orElse(null)),
                new Tool("chronometer", "Chronometer", true, false, false, categoryRepository.findById("measurement").orElse(null)),
                new Tool("qr-code", "QR Code Generator", true, false, false, categoryRepository.findById("images_videos").orElse(null)),
                new Tool("wifi-qr-code", "WiFi QR Code Generator", true, false, false, categoryRepository.findById("images_videos").orElse(null)),
                new Tool("image-to-base64", "Image to Base64", true, false, false, categoryRepository.findById("images_videos").orElse(null)),
                new Tool("json-formatter", "JSON Formatter", true, false, false, categoryRepository.findById("development").orElse(null)),
                new Tool("json-to-csv", "JSON to CSV", true, false, false, categoryRepository.findById("development").orElse(null)),
                new Tool("docker-compose-converter", "Docker Compose Converter", true, false, false, categoryRepository.findById("development").orElse(null)),
                new Tool("nato-converter", "NATO Converter", true, false, false, categoryRepository.findById("converter").orElse(null)),
                new Tool("ipv4", "IPv4 Converter", true, false, false, categoryRepository.findById("network").orElse(null))
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