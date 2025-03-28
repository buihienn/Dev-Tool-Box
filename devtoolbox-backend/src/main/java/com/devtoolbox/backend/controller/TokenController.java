package com.devtoolbox.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.security.SecureRandom;

@RestController
@RequestMapping("/api/auth/token")
@CrossOrigin(origins = "*")
public class TokenController {

    @GetMapping("/generate")
    public String generateToken(
            @RequestParam(required = false, defaultValue = "true") boolean uppercase,
            @RequestParam(required = false, defaultValue = "true") boolean lowercase,
            @RequestParam(required = false, defaultValue = "true") boolean numbers,
            @RequestParam(required = false, defaultValue = "true") boolean symbols,
            @RequestParam(required = false, defaultValue = "64") int length) {

        // Danh sach cac ky tu
        String upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
        String numberChars = "0123456789";
        String symbolChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

        // Tao danh sach ky tu dua tren yeu cau
        StringBuilder characterPool = new StringBuilder();
        if (uppercase) characterPool.append(upperCaseChars);
        if (lowercase) characterPool.append(lowerCaseChars);
        if (numbers) characterPool.append(numberChars);
        if (symbols) characterPool.append(symbolChars);

        // Nếu không có ký tự nào được chọn, trả về lỗi
        if (characterPool.length() == 0) {
            throw new IllegalArgumentException("Phải chọn ít nhất một loại ký tự (uppercase, lowercase, numbers, symbols).");
        }

        // Tạo token ngẫu nhiên
        SecureRandom random = new SecureRandom();
        StringBuilder token = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int randomIndex = random.nextInt(characterPool.length());
            token.append(characterPool.charAt(randomIndex));
        }

        return token.toString();
    }
}