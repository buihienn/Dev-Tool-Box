package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.Ipv4ConverterService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/tool/ipv4")
@CrossOrigin(origins = "*")
public class Ipv4ConverterController {
    
    private final Ipv4ConverterService ipv4ConverterService;
    
    public Ipv4ConverterController(Ipv4ConverterService ipv4ConverterService) {
        this.ipv4ConverterService = ipv4ConverterService;
    }
    
    @GetMapping("/convert")
    public ResponseEntity<Map<String, Object>> convertIpv4Get(@RequestParam String ipAddress) {
        Map<String, Object> result = ipv4ConverterService.convertIpv4Address(ipAddress);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/convert")
    public ResponseEntity<Map<String, Object>> convertIpv4(@RequestBody Map<String, String> request) {
        String ipAddress = request.getOrDefault("ipAddress", "");
        Map<String, Object> result = ipv4ConverterService.convertIpv4Address(ipAddress);
        return ResponseEntity.ok(result);
    }
}