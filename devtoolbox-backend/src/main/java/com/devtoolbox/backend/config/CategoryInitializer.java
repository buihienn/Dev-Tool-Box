package com.devtoolbox.backend.config;

import com.devtoolbox.backend.data.entities.Category;
import com.devtoolbox.backend.data.repositories.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class CategoryInitializer {

    @Bean
    public CommandLineRunner initializeCategories(CategoryRepository categoryRepository) {
        return args -> {
            List<Category> categories = List.of(
                new Category("crypto", "Mã hóa", "", "Các công cụ bảo mật và mã hóa thông tin"),
                new Category("converter", "Chuyển đổi", "", "Các công cụ chuyển đổi định dạng và đơn vị"),
                new Category("web", "Web", "", "Các công cụ hỗ trợ phát triển và kiểm tra web"),
                new Category("images_videos", "Hình ảnh & Video", "", "Các công cụ xử lý hình ảnh và video"),
                new Category("development", "Lập trình", "", "Các công cụ hỗ trợ lập trình và phát triển phần mềm"),
                new Category("network", "Mạng", "", "Các công cụ kiểm tra và phân tích mạng"),
                new Category("math", "Toán học", "", "Các công cụ tính toán và hỗ trợ toán học"),
                new Category("measurement", "Đo lường", "", "Các công cụ đo lường và chuyển đổi đơn vị"),
                new Category("text", "Văn bản", "", "Các công cụ xử lý và phân tích văn bản"),
                new Category("data", "Dữ liệu", "", "Các công cụ xử lý và phân tích dữ liệu"),
                new Category("other", "Other", "", "Các công cụ hỗ trợ khác")
            );

            // Lưu các category nếu chưa tồn tại
            for (Category category : categories) {
                if (!categoryRepository.existsById(category.getId())) {
                    categoryRepository.save(category);
                }
            }
        };
    }
}