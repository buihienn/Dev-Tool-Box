package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.JarLoaderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/tools")
@CrossOrigin(origins = "*")
public class JarLoaderController {

    private final JarLoaderService jarLoaderService;

    public JarLoaderController(JarLoaderService jarLoaderService) {
        this.jarLoaderService = jarLoaderService;
    }

    @PostMapping("/upload-jar")
    public ResponseEntity<String> uploadJar(@RequestParam("file") MultipartFile jarFile) {
        try {
            jarLoaderService.loadJarFile(jarFile);
            return ResponseEntity.ok("Jar file uploaded and loaded successfully!");
        } catch (Exception e) {
            e.printStackTrace(); // Log lỗi chi tiết
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload jar file: " + e.getMessage());
        }
    }
}