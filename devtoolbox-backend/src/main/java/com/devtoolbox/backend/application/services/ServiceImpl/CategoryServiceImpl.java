package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.CategoryService;
import com.devtoolbox.backend.data.entities.Category;
import com.devtoolbox.backend.data.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category createCategory(String name, String description) {
        // Tạo ID từ tên danh mục
        String id = generateIdFromName(name);
        
        // Đảm bảo ID không bị trùng
        int counter = 1;
        String tempId = id;
        while (categoryRepository.existsById(tempId)) {
            tempId = id + "-" + counter;
            counter++;
        }
        
        // Tạo và lưu danh mục mới
        Category category = new Category();
        category.setId(tempId);
        category.setName(name);
        category.setDescription(description);
        
        return categoryRepository.save(category);
    }
    
    @Override
    public boolean existsByName(String name) {
        Category category = categoryRepository.findByName(name);
        return category != null;
    }
    
    /**
     * Tạo ID từ tên danh mục
     * @param name Tên danh mục
     * @return ID được tạo từ tên danh mục
     */
    private String generateIdFromName(String name) {
        return name.toLowerCase()
            .replaceAll("\\s+", "-")       // Thay khoảng trắng bằng gạch ngang
            .replaceAll("[^a-z0-9-]", ""); // Loại bỏ ký tự đặc biệt
    }
}