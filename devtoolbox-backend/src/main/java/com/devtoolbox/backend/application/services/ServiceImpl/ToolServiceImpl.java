package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.ToolService;
import com.devtoolbox.backend.data.entities.Tool;
import com.devtoolbox.backend.data.repositories.FavoriteToolRepository;
import com.devtoolbox.backend.data.repositories.ToolRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ToolServiceImpl  implements ToolService{

    private ToolRepository toolRepository;
    private FavoriteToolRepository favoriteToolRepository;

    public ToolServiceImpl(ToolRepository toolRepository, FavoriteToolRepository favoriteToolRepository) {
        this.toolRepository = toolRepository;
        this.favoriteToolRepository = favoriteToolRepository;
    }

    // Lấy danh sách tất cả công cụ
    public List<Tool> getAllTools() {
        return toolRepository.findAll();
    }

    // Lấy thông tin công cụ theo ID
    public Tool getToolById(String id) {
        return toolRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tool not found with id: " + id));
    }

    // Bổ sung công cụ mới
    public Tool createTool(Tool tool) {
        return toolRepository.save(tool);
    }

    // Loại bỏ công cụ
    public void deleteTool(String id) {
        toolRepository.deleteById(id);
    }

    public boolean isToolEnabled(String id) {
        Tool tool = toolRepository.findById(id).orElse(null);
        return tool != null && tool.getEnabled();
    }
    public Tool getToolByName(String toolName) {
        return toolRepository.findByName(toolName);
    }

    public List<Tool> findAllTools() {
        return toolRepository.findAll();
    }

    public Optional<Tool> findToolById(String id) {
        return toolRepository.findById(id);
    }

    public Tool toggleToolStatus(String toolId, Boolean enabled) {
        System.out.println("Tool ID: " + toolId + ", New enabled status: " + enabled);
        
        Tool tool = toolRepository.findById(toolId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy công cụ với ID: " + toolId));
        
        System.out.println("Current enabled status: " + tool.getEnabled());
        
        tool.setEnabled(enabled);
        tool.setUpdatedAt(LocalDateTime.now()); // Cập nhật thời gian chỉnh sửa
        
        System.out.println("Updated enabled status: " + tool.getEnabled());
        
        return toolRepository.save(tool);
    }

    public Tool toggleToolPremium(String toolId, Boolean isPremium) {
        System.out.println("Tool ID: " + toolId + ", New premium status: " + isPremium);
        
        Tool tool = toolRepository.findById(toolId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy công cụ với ID: " + toolId));
        
        System.out.println("Current premium status: " + tool.getIsPremium());
        
        tool.setIsPremium(isPremium);
        tool.setUpdatedAt(LocalDateTime.now()); // Cập nhật thời gian chỉnh sửa
        
        System.out.println("Updated premium status: " + tool.getIsPremium());
        
        return toolRepository.save(tool);
    }

    @Override
    @Transactional
    public void deleteToolById(String toolId) {
        favoriteToolRepository.deleteByToolId(toolId);
        toolRepository.deleteById(toolId);
    }


}