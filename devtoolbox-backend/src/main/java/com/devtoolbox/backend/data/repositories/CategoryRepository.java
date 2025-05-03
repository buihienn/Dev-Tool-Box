package com.devtoolbox.backend.data.repositories;

import com.devtoolbox.backend.data.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, String> {
    Category findByName(String name);
    boolean existsById(String id);
}