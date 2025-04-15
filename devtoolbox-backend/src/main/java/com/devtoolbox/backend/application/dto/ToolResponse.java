package com.devtoolbox.backend.application.dto;

public class ToolResponse {
    private String id;
    private String name;
    private String category;
    private String level;
    private Boolean enabled;

    // Constructor
    public ToolResponse(String id, String name, String category, String level, Boolean enabled) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.level = level;
        this.enabled = enabled;
    }

    // Getters và Setters
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
}