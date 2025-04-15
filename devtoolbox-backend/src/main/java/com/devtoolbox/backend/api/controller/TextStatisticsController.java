package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.TextStatisticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/tool/text-statistics")
@CrossOrigin(origins = "*")
public class TextStatisticsController {
    
    private final TextStatisticsService textStatisticsService;
    
    public TextStatisticsController(TextStatisticsService textStatisticsService) {
        this.textStatisticsService = textStatisticsService;
    }
    
    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeText(@RequestBody Map<String, String> payload) {
        String text = payload.getOrDefault("text", "");
        Map<String, Object> statistics = textStatisticsService.analyzeText(text);
        return ResponseEntity.ok(statistics);
    }
}