package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.CategoryService;
import com.devtoolbox.backend.data.entities.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/all")
    public List<Category> getAllCategories() {
        System.out.println("Fetching all categories...");
        return categoryService.getAllCategories();
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCategory(@RequestBody Map<String, String> categoryData) {
        try {
            // Lấy dữ liệu từ request
            String name = categoryData.get("name");
            String description = categoryData.getOrDefault("description", "");
            
            // Validate dữ liệu
            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Tên danh mục không được để trống"));
            }
            
            // Kiểm tra danh mục đã tồn tại chưa
            if (categoryService.existsByName(name)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Danh mục với tên này đã tồn tại"));
            }
            
            // Tạo danh mục mới
            Category newCategory = categoryService.createCategory(name, description);
            
            // Tạo response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tạo danh mục thành công");
            response.put("category", newCategory);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Xử lý lỗi
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Lỗi khi tạo danh mục: " + e.getMessage()));
        }
    }
}