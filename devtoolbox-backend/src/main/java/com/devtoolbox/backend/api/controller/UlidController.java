package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.UlidService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/auth/ulid")
public class UlidController {

    private final UlidService ulidService;

    public UlidController(UlidService ulidService) {
        this.ulidService = ulidService;
    }

    @GetMapping("/generate")
    public Object generateUlid(
            @RequestParam(defaultValue = "1") int quantity,
            @RequestParam(defaultValue = "Raw") String format) {
        // Gọi service để tạo danh sách ULID
        List<String> ulids = ulidService.generateUlids(quantity);

        // Trả về kết quả theo định dạng
        if ("JSON".equalsIgnoreCase(format)) {
            return ulids; // Trả về danh sách ULID dưới dạng JSON
        }
        return String.join("\n", ulids); // Trả về chuỗi ULID cách nhau bởi dấu xuống dòng
    }
}