package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.CategoryService;
import com.devtoolbox.backend.data.entities.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/all")
    public List<Category> getAllCategories() {
        System.out.println("Fetching all categories..."); // In ra console để kiểm tra
        return categoryService.getAllCategories(); // Trả về danh sách tất cả danh mục
    }
}