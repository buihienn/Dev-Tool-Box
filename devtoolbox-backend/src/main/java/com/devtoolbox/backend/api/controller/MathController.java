package com.devtoolbox.backend.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.devtoolbox.backend.application.services.MathService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/tool/math")
public class MathController {

    private final MathService mathService;

    public MathController(MathService mathService) {
        this.mathService = mathService;
    }

    @GetMapping("/evaluate")
    public ResponseEntity<?> evaluateExpression(@RequestParam String expression) {
        try {
            // Kiểm tra biểu thức đầu vào
            if (expression == null || expression.trim().isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Biểu thức không được để trống");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }

            // Tính toán biểu thức
            double result = mathService.evaluateExpression(expression);
            
            // Trả về kết quả
            Map<String, Object> response = new HashMap<>();
            response.put("expression", expression);
            response.put("result", result);
            
            return new ResponseEntity<>(response, HttpStatus.OK);
            
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Lỗi khi đánh giá biểu thức: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}