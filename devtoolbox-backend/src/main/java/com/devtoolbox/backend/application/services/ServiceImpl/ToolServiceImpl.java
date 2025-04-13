package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.ToolService;
import com.devtoolbox.backend.data.entities.Tool;
import com.devtoolbox.backend.data.repositories.ToolRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ToolServiceImpl  implements ToolService{

    private ToolRepository toolRepository;

    public ToolServiceImpl(ToolRepository toolRepository) {
        this.toolRepository = toolRepository;
    }

    // Lấy danh sách tất cả công cụ
    public List<Tool> getAllTools() {
        return toolRepository.findAll();
    }

    // Lấy thông tin công cụ theo ID
    public Tool getToolById(Long id) {
        return toolRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tool not found with id: " + id));
    }

    // Bổ sung công cụ mới
    public Tool createTool(Tool tool) {
        return toolRepository.save(tool);
    }

    // Loại bỏ công cụ
    public void deleteTool(Long id) {
        toolRepository.deleteById(id);
    }

    // Enable/Disable công cụ
    public Tool enableTool(Long id, boolean enabled) {
        Tool tool = getToolById(id);
        tool.setEnabled(enabled);
        return toolRepository.save(tool);
    }

    // Nâng/Hạ cấp công cụ (Premium/Regular)
    public Tool upgradeTool(Long id, Tool.Level level) {
        Tool tool = getToolById(id);
        tool.setLevel(level);
        return toolRepository.save(tool);
    }
}