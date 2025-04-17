package com.devtoolbox.backend.application.services;

import com.devtoolbox.backend.data.entities.Tool;
import java.util.List;
import java.util.Optional;

public interface ToolService {

    // Lấy danh sách tất cả công cụ
    List<Tool> getAllTools();

    // Lấy thông tin công cụ theo ID
    Tool getToolById(String id);

    // Bổ sung công cụ mới
    Tool createTool(Tool tool);

    // Loại bỏ công cụ
    void deleteTool(String id);

    boolean isToolEnabled(String id);

    Tool getToolByName(String toolName);

    List<Tool> findAllTools();
    
    Optional<Tool> findToolById(String id);
    
    // Enable/disable công cụ
    Tool toggleToolStatus(String toolId, Boolean enabled);

    // Nâng/Hạ cấp công cụ
    Tool toggleToolPremium(String toolId, Boolean isPremium);
}