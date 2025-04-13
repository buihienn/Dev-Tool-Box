package com.devtoolbox.backend.application.services;

import com.devtoolbox.backend.data.entities.Tool;

import java.util.List;

public interface ToolService {

    // Lấy danh sách tất cả công cụ
    List<Tool> getAllTools();

    // Lấy thông tin công cụ theo ID
    Tool getToolById(Long id);

    // Bổ sung công cụ mới
    Tool createTool(Tool tool);

    // Loại bỏ công cụ
    void deleteTool(Long id);

    // Enable/Disable công cụ
    Tool enableTool(Long id, boolean enabled);

    // Nâng/Hạ cấp công cụ (Premium/Regular)
    Tool upgradeTool(Long id, Tool.Level level);
}