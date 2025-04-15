package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.NumeronymService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/tool/numeronym")
@CrossOrigin(origins = "*")
public class NumeronymController {
    
    private final NumeronymService numeronymService;
    
    public NumeronymController(NumeronymService numeronymService) {
        this.numeronymService = numeronymService;
    }
    
    @PostMapping("/generate")
    public ResponseEntity<Map<String, String>> generateNumeronym(@RequestBody Map<String, String> request) {
        String input = request.getOrDefault("text", "");
        String result = numeronymService.generateSentenceNumeronyms(input);
        
        Map<String, String> response = new HashMap<>();
        response.put("result", result);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/generate")
    public ResponseEntity<Map<String, String>> generateNumeronymGet(@RequestParam(required = false) String text) {
        String input = text != null ? text : "";
        String result = numeronymService.generateSentenceNumeronyms(input);
        
        Map<String, String> response = new HashMap<>();
        response.put("result", result);
        
        return ResponseEntity.ok(response);
    }
}