package com.devtoolbox.backend.config;

import com.devtoolbox.backend.data.entities.Role;
import com.devtoolbox.backend.data.entities.User;
import com.devtoolbox.backend.data.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    public CommandLineRunner initializeAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@gmail.com";
            String adminPassword = "admin123";

            // Kiểm tra xem admin đã tồn tại chưa
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                User admin = new User();
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(Role.ADMIN); // Đặt vai trò là ADMIN
                admin.setVerified(true); // Đánh dấu tài khoản đã xác minh
                admin.setPremium(true);; // Đánh dấu tài khoản đã kích hoạt
                userRepository.save(admin);
                System.out.println("Admin account created: " + adminEmail);
            } else {
                System.out.println("Admin account already exists.");
            }
        };
    }
}