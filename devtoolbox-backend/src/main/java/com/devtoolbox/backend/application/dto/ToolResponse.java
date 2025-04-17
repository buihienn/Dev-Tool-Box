package com.devtoolbox.backend.application.dto;

public class ToolResponse {
    private String id;
    private String name;
    private String description;
    private String category;
    private Boolean isNew;
    private Boolean isPremium;
    private Boolean isEnabled;

    public ToolResponse(String id, String name, String description, String category, Boolean isNew, Boolean isPremium, Boolean isEnabled) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.isNew = isNew;
        this.isPremium = isPremium;
        this.isEnabled = isEnabled;
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

    public Boolean getIsNew() {
        return isNew;
    }

    public void setIsNew(Boolean isNew) {
        this.isNew = isNew;
    }

    public Boolean getIsPremium() {
        return isPremium;
    }

    public void setIsPremium(Boolean isPremium) {
        this.isPremium = isPremium;
    }

    public Boolean getIsEnabled() {
        return isEnabled;
    }

    public void setIsEnabled(Boolean isEnabled) {
        this.isEnabled = isEnabled;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}