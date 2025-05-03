package com.devtoolbox.backend.application.services;

import com.devtoolbox.backend.data.entities.Category;
import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();
    Category createCategory(String name, String description);
    boolean existsByName(String name);
}