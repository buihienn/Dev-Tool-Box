package com.devtoolbox.backend.data.repositories;

import com.devtoolbox.backend.data.entities.Tool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ToolRepository extends JpaRepository<Tool, Long> {
    Tool findByName(String name);
}