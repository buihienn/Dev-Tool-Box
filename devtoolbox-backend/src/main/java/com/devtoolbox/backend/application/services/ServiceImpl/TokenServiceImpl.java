package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.TokenService;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class TokenServiceImpl implements TokenService {

    @Override
    public String generateToken(boolean uppercase, boolean lowercase, boolean numbers, boolean symbols, int length) {
        // Danh sách các ký tự
        String upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
        String numberChars = "0123456789";
        String symbolChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

        // Tạo danh sách ký tự dựa trên yêu cầu
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