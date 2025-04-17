package com.devtoolbox.backend.application.dto;

public class ToggleStatusRequest {
    private String toolId;
    private Boolean enabled;

    // Constructors
    public ToggleStatusRequest() {
    }

    public ToggleStatusRequest(String toolId, Boolean enabled) {
        this.toolId = toolId;
        this.enabled = enabled;
    }

    // Getters and setters
    public String getToolId() {
        return toolId;
    }

    public void setToolId(String toolId) {
        this.toolId = toolId;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
}