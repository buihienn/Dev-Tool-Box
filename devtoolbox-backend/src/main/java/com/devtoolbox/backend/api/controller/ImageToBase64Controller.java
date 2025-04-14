package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.ImageToBase64Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/tool/image-to-base64")
public class ImageToBase64Controller {

    private final ImageToBase64Service imageToBase64Service;

    public ImageToBase64Controller(ImageToBase64Service imageToBase64Service) {
        this.imageToBase64Service = imageToBase64Service;
    }

    @PostMapping("/convert")
    public ResponseEntity<Map<String, String>> convertImageToBase64(@RequestParam("file") MultipartFile file) {
        try {
            // Lấy chuỗi Base64 và mã HTML
            String base64 = imageToBase64Service.convertToBase64(file);
            String html = imageToBase64Service.convertToHTML(file);

            // Tạo đối tượng JSON để trả về
            Map<String, String> response = new HashMap<>();
            response.put("base64", base64);
            response.put("html", html);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Trả về lỗi nếu có vấn đề
            return ResponseEntity.badRequest().body(null);
        }
    }
}