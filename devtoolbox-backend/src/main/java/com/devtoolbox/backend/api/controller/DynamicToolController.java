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

            // Kiểm tra nếu kết quả là chuỗi RAW
            if (result instanceof String) {
                return ResponseEntity.ok()
                        .header("Content-Type", "text/plain") // Đặt Content-Type là text/plain
                        .body(result);
            }

            // Mặc định trả về JSON
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