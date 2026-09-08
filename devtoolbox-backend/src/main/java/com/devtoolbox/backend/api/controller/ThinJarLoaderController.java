package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.ThinJarLoaderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/thin-jar")
public class ThinJarLoaderController {

    private final ThinJarLoaderService thinJarLoaderService;

    @Autowired
    public ThinJarLoaderController(ThinJarLoaderService thinJarLoaderService) {
        this.thinJarLoaderService = thinJarLoaderService;
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> uploadThinJar(@RequestParam("file") MultipartFile jarFile) {
        try {
            if (jarFile.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
            }

            thinJarLoaderService.loadJarFile(jarFile);
            return ResponseEntity.ok("Thin JAR uploaded and processed successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload and process Thin JAR: " + e.getMessage());
        }
    }
}
