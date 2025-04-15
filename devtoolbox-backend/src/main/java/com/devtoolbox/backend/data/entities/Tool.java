package com.devtoolbox.backend.data.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tools")
public class Tool {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private Boolean enabled = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Level level = Level.REGULAR;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category; // Liên kết với bảng categories

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum Level {
        REGULAR,
        PREMIUM
    }

    // Getters và Setters
    public Tool() {
    }

    public Tool(String id, String name, Boolean enabled, Level level, Category category) {
        this.id = id;
        this.name = name;
        this.enabled = enabled;
        this.level = level;
        this.category = category;
    }
    
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Level getLevel() {
        return level;
    }
    public void setLevel(Level level) {
        this.level = level;
    }
    public Category getCategory() {
        return category;
    }
    public void setCategory(Category category) {
        this.category = category;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    

}