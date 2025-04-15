package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.Ipv4RangeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/tool/ipv4-range")
@CrossOrigin(origins = "*")
public class Ipv4RangeController {

    private final Ipv4RangeService ipv4RangeService;
    
    public Ipv4RangeController(Ipv4RangeService ipv4RangeService) {
        this.ipv4RangeService = ipv4RangeService;
    }
    
    @PostMapping("/calculate")
    public ResponseEntity<Map<String, Object>> calculateRange(@RequestBody Map<String, String> request) {
        String startIp = request.getOrDefault("startIp", "");
        String endIp = request.getOrDefault("endIp", "");
        
        Map<String, Object> result = ipv4RangeService.calculateIpv4Range(startIp, endIp);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/calculate")
    public ResponseEntity<Map<String, Object>> calculateRangeGet(
            @RequestParam String startIp, 
            @RequestParam String endIp) {
        
        Map<String, Object> result = ipv4RangeService.calculateIpv4Range(startIp, endIp);
        return ResponseEntity.ok(result);
    }
}