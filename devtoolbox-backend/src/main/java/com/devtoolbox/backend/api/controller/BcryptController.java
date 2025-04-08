package com.devtoolbox.backend.api.controller;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import com.devtoolbox.backend.application.services.BcryptService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/bcrypt")
public class BcryptController {

    private final BcryptService bcryptService;

    public BcryptController(BcryptService bcryptService) {
        this.bcryptService = bcryptService;
    }

    // API để hash chuỗi
    @PostMapping("/hash")
    public Map<String, String> hashString(@RequestBody Map<String, Object> request) {
        String inputString = (String) request.get("inputString");
        int saltRounds = (int) request.get("saltRounds");

        // Gọi service để tạo hash
        String hash = bcryptService.hashString(inputString, saltRounds);

        return Map.of("hash", hash);
    }

    // API để so sánh chuỗi với hash
    @PostMapping("/compare")
    public Map<String, Object> compareStringWithHash(@RequestBody Map<String, String> request) {
        String inputString = request.get("inputString");
        String hash = request.get("hash");

        // Gọi service để so sánh chuỗi với hash
        boolean isMatch = bcryptService.compareStringWithHash(inputString, hash);

        return Map.of("isMatch", isMatch);
    }
}