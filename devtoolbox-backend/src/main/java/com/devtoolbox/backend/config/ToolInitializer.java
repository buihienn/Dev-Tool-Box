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
                new Tool("token", "Trình tạo mã thông báo", "Tạo mã thông báo ngẫu nhiên với độ dài tùy chỉnh và nhiều tùy chọn khác nhau.", true, false, true, categoryRepository.findById("crypto").orElse(null)),
                new Tool("hash", "Mã hóa văn bản", "Mã hóa văn bản của bạn bằng nhiều thuật toán mã hóa khác nhau như MD5, SHA-1, SHA-256 và nhiều thuật toán khác.", true, false, true, categoryRepository.findById("crypto").orElse(null)),
                new Tool("bcrypt", "Bcrypt", "Mã hóa mật khẩu bằng thuật toán BCrypt - một thuật toán an toàn và đáng tin cậy cho việc lưu trữ mật khẩu.", true, false, true, categoryRepository.findById("crypto").orElse(null)),
                new Tool("base-converter", "Chuyển đổi cơ số", "Chuyển đổi số giữa các hệ cơ số khác nhau (nhị phân, bát phân, thập phân, thập lục phân).", true, false, false, categoryRepository.findById("converter").orElse(null)),
                new Tool("text-to-nato-alphabet", "Chuyển đổi văn bản thành bảng chữ cái NATO", "Chuyển đổi văn bản thành bảng chữ cái NATO (Alpha, Bravo, Charlie...).", true, false, false, categoryRepository.findById("converter").orElse(null)),
                new Tool("xml-to-json", "Chuyển XML sang JSON", "Chuyển đổi dữ liệu XML sang định dạng JSON và ngược lại.", true, false, false, categoryRepository.findById("converter").orElse(null)),
                new Tool("url-parser", "Phân tích URL", "Phân tích các thành phần của URL như protocol, host, path và query parameters.", true, false, false, categoryRepository.findById("web").orElse(null)),
                new Tool("url-formatter", "Định dạng URL", "Định dạng lại các URL không hợp lệ thành URL chuẩn hóa.", true, false, false, categoryRepository.findById("web").orElse(null)),
                new Tool("jwt-parser", "Phân tích JWT", "Giải mã và phân tích các token JWT (JSON Web Token) thành phần header, payload và signature.", true, false, false, categoryRepository.findById("web").orElse(null)),
                new Tool("qr-code", "Tạo mã QR", "Tạo mã QR từ văn bản, URL hoặc thông tin liên hệ với nhiều tùy chỉnh.", true, false, false, categoryRepository.findById("images_videos").orElse(null)),
                new Tool("wifi-qr-code", "Tạo mã QR WiFi", "Tạo mã QR cho phép kết nối với mạng WiFi mà không cần nhập mật khẩu.", true, false, false, categoryRepository.findById("images_videos").orElse(null)), 
                new Tool("image-to-base64", "Chuyển ảnh sang Base64", "Chuyển đổi hình ảnh thành chuỗi Base64 để nhúng vào HTML, CSS hoặc lưu trữ.", true, false, false, categoryRepository.findById("images_videos").orElse(null)),
                new Tool("json-formatter", "Định dạng JSON", "Định dạng và làm đẹp JSON với các tùy chọn indentation và highlighting.", true, false, false, categoryRepository.findById("development").orElse(null)),
                new Tool("json-to-csv", "Chuyển JSON sang CSV", "Chuyển đổi dữ liệu JSON sang định dạng CSV và ngược lại.", true, false, false, categoryRepository.findById("development").orElse(null)),
                new Tool("docker-compose-converter", "Chuyển đổi Docker Compose", "Chuyển đổi giữa các phiên bản cú pháp của Docker Compose (v1, v2, v3).", true, false, false, categoryRepository.findById("development").orElse(null)),
                new Tool("math", "Đánh giá biểu thức toán học", "Tính toán các biểu thức toán học phức tạp với nhiều hàm và hằng số khác nhau.", true, false, false, categoryRepository.findById("math").orElse(null)),
                new Tool("eta-calculator", "Máy tính ETA", "Tính thời gian đến dự kiến dựa trên tốc độ, khoảng cách và các yếu tố khác.", true, false, true, categoryRepository.findById("math").orElse(null)),
                new Tool("percentage-calculator", "Máy tính phần trăm", "Tính toán phần trăm, tăng/giảm phần trăm và các bài toán phần trăm khác.", true, false, false, categoryRepository.findById("math").orElse(null)),
                new Tool("chronometer", "Đồng hồ bấm giờ", "Đồng hồ bấm giờ đa chức năng với tùy chọn đặt vòng, tạm dừng và tiếp tục.", true, false, true, categoryRepository.findById("measurement").orElse(null)),
                new Tool("temperature-converter", "Bộ chuyển đổi nhiệt độ", "Chuyển đổi nhiệt độ giữa các đơn vị Celsius, Fahrenheit, Kelvin và Rankine.", true, false, false, categoryRepository.findById("measurement").orElse(null)),
                new Tool("benchmark", "Trình tạo bảng đánh giá", "Tạo và phân tích các bảng đánh giá hiệu năng với biểu đồ và thống kê.", true, false, false, categoryRepository.findById("measurement").orElse(null)),
                new Tool("lorem-ipsum", "Trình tạo văn bản Lorem Ipsum", "Tạo văn bản giả Lorem Ipsum với số lượng từ, câu, đoạn tùy chỉnh.", true, false, false, categoryRepository.findById("text").orElse(null)),
                new Tool("text-statistics", "Thống kê văn bản", "Phân tích văn bản và hiển thị các thống kê về số từ, câu, ký tự và độ đọc.", true, false, false, categoryRepository.findById("text").orElse(null)),
                new Tool("numeronym", "Trình tạo Numeronym", "Tạo numeronym (như i18n, a11y, k8s) từ các từ dài.", true, false, true, categoryRepository.findById("text").orElse(null)),
                new Tool("phone-parser", "Trình phân tích và định dạng số điện thoại", "Phân tích và định dạng số điện thoại theo các chuẩn quốc tế khác nhau.", true, false, false, categoryRepository.findById("data").orElse(null)),
                new Tool("iban", "Kiểm tra và phân tích số IBAN", "Kiểm tra tính hợp lệ và phân tích các thành phần của số IBAN ngân hàng.", true, false, false, categoryRepository.findById("data").orElse(null)),
                new Tool("credit-card", "Xác thực thẻ tín dụng", "Xác thực số thẻ tín dụng theo thuật toán Luhn và nhận dạng loại thẻ.", true, false, false, categoryRepository.findById("data").orElse(null)),
                new Tool("mac-address", "Trình tạo địa chỉ MAC", "Tạo địa chỉ MAC ngẫu nhiên hoặc theo nhà sản xuất cụ thể.", true, false, false, categoryRepository.findById("network").orElse(null)),
                new Tool("ipv4", "Chuyển đổi IPv4", "Chuyển đổi địa chỉ IPv4 giữa dạng decimal, binary và hexadecimal.", true, false, true, categoryRepository.findById("network").orElse(null)),
                new Tool("ipv4-range", "Mở rộng dải địa chỉ IPv4", "Mở rộng dải địa chỉ IPv4 CIDR thành danh sách các địa chỉ riêng lẻ.", true, false, false, categoryRepository.findById("network").orElse(null))
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