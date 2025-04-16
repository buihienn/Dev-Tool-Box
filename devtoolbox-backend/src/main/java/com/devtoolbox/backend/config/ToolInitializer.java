package com.devtoolbox.backend.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import com.devtoolbox.backend.data.entities.Tool;
import com.devtoolbox.backend.data.repositories.CategoryRepository;
import com.devtoolbox.backend.data.repositories.ToolRepository;

@Configuration
@Order(2) // Đảm bảo rằng ToolInitializer được thực thi sau CategoryInitializer
public class ToolInitializer {

    @Bean
    public CommandLineRunner initializeTools(ToolRepository toolRepository, CategoryRepository categoryRepository) {
        return args -> {
            // Danh sách các tool cần khởi tạo
            List<Tool> tools = List.of(
                new Tool("token", "Trình tạo mã thông báo", true, false, false, categoryRepository.findById("crypto").orElse(null)),
                new Tool("hash", "Mã hóa văn bản", true, false, false, categoryRepository.findById("crypto").orElse(null)),
                new Tool("bcrypt", "Bcrypt", true, false, false, categoryRepository.findById("crypto").orElse(null)),
                new Tool("ulid", "Trình tạo ULID", true, false, false, categoryRepository.findById("crypto").orElse(null)),
                new Tool("base-converter", "Chuyển đổi cơ số", true, false, false, categoryRepository.findById("converter").orElse(null)),
                new Tool("text-to-nato-alphabet", "Chuyển đổi văn bản thành bảng chữ cái NATO", true, false, false, categoryRepository.findById("converter").orElse(null)),
                new Tool("xml-to-json", "Chuyển XML sang JSON", true, false, false, categoryRepository.findById("converter").orElse(null)),
                new Tool("url-parser", "Phân tích URL", true, false, false, categoryRepository.findById("web").orElse(null)),
                new Tool("url-formatter", "Định dạng URL", true, false, false, categoryRepository.findById("web").orElse(null)),
                new Tool("jwt-parser", "Phân tích JWT", true, false, false, categoryRepository.findById("web").orElse(null)),
                new Tool("qr-code", "Tạo mã QR", true, false, false, categoryRepository.findById("images_videos").orElse(null)),
                new Tool("wifi-qr-code", "Tạo mã QR WiFi", true, false, false, categoryRepository.findById("images_videos").orElse(null)), 
                new Tool("image-to-base64", "Chuyển ảnh sang Base64", true, false, false, categoryRepository.findById("images_videos").orElse(null)),
                new Tool("json-formatter", "Định dạng JSON", true, false, false, categoryRepository.findById("development").orElse(null)),
                new Tool("json-to-csv", "Chuyển JSON sang CSV", true, false, false, categoryRepository.findById("development").orElse(null)),
                new Tool("docker-compose-converter", "Chuyển đổi Docker Compose", true, false, false, categoryRepository.findById("development").orElse(null)),
                new Tool("math", "Đánh giá biểu thức toán học", true, false, true, categoryRepository.findById("math").orElse(null)),
                new Tool("eta-calculator", "Máy tính ETA", true, false, true, categoryRepository.findById("math").orElse(null)),
                new Tool("percentage-calculator", "Máy tính phần trăm", true, false, true, categoryRepository.findById("math").orElse(null)),
                new Tool("chronometer", "Đồng hồ bấm giờ", true, false, true, categoryRepository.findById("measurement").orElse(null)),
                new Tool("temperature-converter", "Bộ chuyển đổi nhiệt độ", true, false, true, categoryRepository.findById("measurement").orElse(null)),
                new Tool("benchmark", "Trình tạo bảng đánh giá", true, false, true, categoryRepository.findById("measurement").orElse(null)),
                new Tool("lorem-ipsum", "Trình tạo văn bản Lorem Ipsum", true, false, true, categoryRepository.findById("text").orElse(null)),
                new Tool("text-statistics", "Thống kê văn bản", true, false, true, categoryRepository.findById("text").orElse(null)),
                new Tool("numeronym", "Trình tạo Numeronym", true, false, true, categoryRepository.findById("text").orElse(null)),
                new Tool("phone-parser", "Trình phân tích và định dạng số điện thoại", true, false, true, categoryRepository.findById("data").orElse(null)),
                new Tool("iban", "Kiểm tra và phân tích số IBAN", true, false, true, categoryRepository.findById("data").orElse(null)),
                new Tool("credit-card", "Xác thực thẻ tín dụng", true, false, true, categoryRepository.findById("data").orElse(null)),
                new Tool("mac-address", "Trình tạo địa chỉ MAC", true, false, true, categoryRepository.findById("network").orElse(null)),
                new Tool("ipv4", "Chuyển đổi IPv4", true, false, true, categoryRepository.findById("network").orElse(null)),
                new Tool("ipv4-range", "Mở rộng dải địa chỉ IPv4", true, false, true, categoryRepository.findById("network").orElse(null))
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