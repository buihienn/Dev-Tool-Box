package com.devtoolbox.backend.application.dto;

public class TogglePremiumResponse {
    private String toolId;
    private String name;
    private Boolean isPremium;

    // Constructors
    public TogglePremiumResponse() {
    }

    public TogglePremiumResponse(String toolId, String name, Boolean isPremium) {
        this.toolId = toolId;
        this.name = name;
        this.isPremium = isPremium;
    }

    // Getters and setters
    public String getToolId() {
        return toolId;
    }

    public void setToolId(String toolId) {
        this.toolId = toolId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getIsPremium() {
        return isPremium;
    }

    public void setIsPremium(Boolean isPremium) {
        this.isPremium = isPremium;
    }
}