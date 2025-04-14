package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.JSONFormatterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/tool/json-formatter")
public class JSONFormatterController {

    private final JSONFormatterService jsonFormatterService;

    public JSONFormatterController(JSONFormatterService jsonFormatterService) {
        this.jsonFormatterService = jsonFormatterService;
    }

    @PostMapping("/format")
    public ResponseEntity<Map<String, String>> formatJSON(
            @RequestBody Map<String, Object> requestBody) {
        try {
            String rawJson = (String) requestBody.get("rawJson");
            int indentSize = (int) requestBody.get("indentSize");

            // Gọi service để định dạng JSON
            String formattedJson = jsonFormatterService.formatJSON(rawJson, indentSize);

            // Trả về JSON đã định dạng
            Map<String, String> response = new HashMap<>();
            response.put("formattedJson", formattedJson);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Trả về lỗi nếu JSON không hợp lệ
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid JSON input."));
        }
    }
}