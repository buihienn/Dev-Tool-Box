package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.CreditCardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/tool/credit-card")
@CrossOrigin(origins = "*")
public class CreditCardController {
    
    private final CreditCardService creditCardService;
    
    public CreditCardController(CreditCardService creditCardService) {
        this.creditCardService = creditCardService;
    }
    
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateCard(@RequestBody Map<String, String> request) {
        String cardNumber = request.getOrDefault("cardNumber", "");
        String expiryDate = request.getOrDefault("expiryDate", "");
        String cvv = request.getOrDefault("cvv", "");
        
        Map<String, Object> result = creditCardService.validateAndParseCardNumber(cardNumber, expiryDate, cvv);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/examples")
    public ResponseEntity<Map<String, Object>> getCardExamples() {
        Map<String, Object> examples = creditCardService.getCardExamples();
        return ResponseEntity.ok(examples);
    }
    
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateCardGet(@RequestParam String cardNumber, 
                                                             @RequestParam(required = false) String expiryDate,
                                                             @RequestParam(required = false) String cvv) {
        Map<String, Object> result = creditCardService.validateAndParseCardNumber(cardNumber, expiryDate, cvv);
        return ResponseEntity.ok(result);
    }
}