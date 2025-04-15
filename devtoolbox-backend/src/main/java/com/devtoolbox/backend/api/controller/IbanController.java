package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.IbanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/tool/iban")
@CrossOrigin(origins = "*")
public class IbanController {
    
    private final IbanService ibanService;
    
    public IbanController(IbanService ibanService) {
        this.ibanService = ibanService;
    }
    
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateIban(@RequestBody Map<String, String> request) {
        String iban = request.getOrDefault("iban", "");
        Map<String, Object> result = ibanService.validateAndParseIban(iban);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/examples")
    public ResponseEntity<Map<String, Object>> getIbanExamples() {
        Map<String, Object> examples = ibanService.getIbanExamples();
        return ResponseEntity.ok(examples);
    }
    
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateIbanGet(@RequestParam String iban) {
        Map<String, Object> result = ibanService.validateAndParseIban(iban);
        return ResponseEntity.ok(result);
    }
}