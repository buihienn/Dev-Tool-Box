package com.devtoolbox.backend.application.dto;

public class ToggleStatusResponse {
    private String toolId;
    private String name;
    private Boolean enabled;

    // Constructors
    public ToggleStatusResponse() {
    }

    public ToggleStatusResponse(String toolId, String name, Boolean enabled) {
        this.toolId = toolId;
        this.name = name;
        this.enabled = enabled;
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

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
}