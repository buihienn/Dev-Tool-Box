package com.devtoolbox.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID; // ✅ Import UUID

@RestController
@RequestMapping("/api/token")
@CrossOrigin(origins = "*")
public class TokenController {

    @GetMapping("/generate") // ✅ Đảm bảo annotation đúng
    public String generateToken() {
        return UUID.randomUUID().toString(); // ✅ Phát sinh token UUID
    }
}