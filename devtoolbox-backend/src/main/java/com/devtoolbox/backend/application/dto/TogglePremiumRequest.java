package com.devtoolbox.backend.application.dto;

public class TogglePremiumRequest {
    private String toolId;
    private Boolean isPremium;

    // Constructors
    public TogglePremiumRequest() {
    }

    public TogglePremiumRequest(String toolId, Boolean isPremium) {
        this.toolId = toolId;
        this.isPremium = isPremium;
    }

    // Getters and setters
    public String getToolId() {
        return toolId;
    }

    public void setToolId(String toolId) {
        this.toolId = toolId;
    }

    public Boolean getIsPremium() {
        return isPremium;
    }

    public void setIsPremium(Boolean isPremium) {
        this.isPremium = isPremium;
    }
}