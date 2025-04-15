package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.MacAddressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tool/mac-address")
@CrossOrigin(origins = "*")
public class MacAddressController {
    
    private final MacAddressService macAddressService;
    
    public MacAddressController(MacAddressService macAddressService) {
        this.macAddressService = macAddressService;
    }
    
    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateMacAddresses(@RequestBody Map<String, Object> request) {
        // Lấy các tham số từ request
        int quantity = Integer.parseInt(request.getOrDefault("quantity", 1).toString());
        String prefix = (String) request.getOrDefault("prefix", "");
        boolean uppercase = Boolean.parseBoolean(request.getOrDefault("uppercase", true).toString());
        String separator = (String) request.getOrDefault("separator", ":");
        
        // Kiểm tra tính hợp lệ của tiền tố
        Map<String, Object> prefixValidation = macAddressService.validateMacPrefix(prefix);
        if (!(boolean) prefixValidation.get("valid")) {
            return ResponseEntity.badRequest().body(prefixValidation);
        }
        
        // Tạo địa chỉ MAC
        List<String> macAddresses = macAddressService.generateMacAddresses(quantity, prefix, uppercase, separator);
        
        // Tạo kết quả
        Map<String, Object> result = new HashMap<>();
        result.put("macAddresses", macAddresses);
        result.put("quantity", macAddresses.size());
        result.put("prefix", prefix);
        result.put("uppercase", uppercase);
        result.put("separator", separator);
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/validate-prefix")
    public ResponseEntity<Map<String, Object>> validatePrefix(@RequestParam String prefix) {
        Map<String, Object> result = macAddressService.validateMacPrefix(prefix);
        return ResponseEntity.ok(result);
    }
}