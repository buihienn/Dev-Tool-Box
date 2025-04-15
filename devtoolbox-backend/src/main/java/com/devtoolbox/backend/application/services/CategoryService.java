package com.devtoolbox.backend.application.services;

import com.devtoolbox.backend.data.entities.Category;
import com.devtoolbox.backend.data.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll(); // Lấy tất cả danh mục từ cơ sở dữ liệu
    }
}