package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.PhoneParserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/tool/phone-parser")
@CrossOrigin(origins = "*")
public class PhoneParserController {
    
    private final PhoneParserService phoneParserService;

    public PhoneParserController(PhoneParserService phoneParserService) {
        this.phoneParserService = phoneParserService;
    }
    
    @PostMapping("/parse")
    public ResponseEntity<Map<String, Object>> parsePhoneNumber(
            @RequestBody Map<String, String> request
    ) {
        String phoneNumber = request.getOrDefault("phoneNumber", "");
        String countryCode = request.getOrDefault("countryCode", "VN");
        
        Map<String, Object> result = phoneParserService.parsePhoneNumber(phoneNumber, countryCode);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/countries")
    public ResponseEntity<Map<String, Object>> getSupportedCountries() {
        Map<String, Object> countries = phoneParserService.getSupportedCountries();
        return ResponseEntity.ok(countries);
    }
}