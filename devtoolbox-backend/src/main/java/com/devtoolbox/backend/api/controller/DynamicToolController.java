package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.DynamicToolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class DynamicToolController {

    @Autowired
    private DynamicToolService dynamicToolService;

    @PostMapping("/invoke")
    public ResponseEntity<Object> invokeTool(
            @RequestParam String serviceName,
            @RequestParam String methodName,
            @RequestBody Map<String, Object> params) {
        try {
            Object result = dynamicToolService.invokeTool(serviceName, methodName, params);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error invoking tool: " + e.getMessage());
        }
    }

    @GetMapping("/services")
    public ResponseEntity<Object> getRegisteredServices() {
        try {
            Map<String, Object> services = dynamicToolService.getRegisteredServices();
            return ResponseEntity.ok(services.keySet()); // Trả về danh sách các serviceName
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error retrieving services: " + e.getMessage());
        }
    }
}