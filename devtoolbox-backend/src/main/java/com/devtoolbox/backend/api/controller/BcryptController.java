package com.devtoolbox.backend.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import com.devtoolbox.backend.application.services.BcryptService;

@RestController
@RequestMapping("/tool/bcrypt")
public class BcryptController {

    private final BcryptService bcryptService;

    public BcryptController(BcryptService bcryptService) {
        this.bcryptService = bcryptService;
    }

    // API để hash chuỗi
    @PostMapping("/hash")
    public Map<String, String> hashString(@RequestBody Map<String, Object> request) {
        String inputString = (String) request.get("inputString");
        Object saltRoundsObj = request.get("saltRounds");

        if (inputString == null || saltRoundsObj == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "inputString and saltRounds are required");
        }

        int saltRounds;
        try {
            saltRounds = (int) saltRoundsObj;
        } catch (ClassCastException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "saltRounds must be an integer");
        }

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