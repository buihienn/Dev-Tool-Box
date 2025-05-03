package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.dto.TogglePremiumRequest;
import com.devtoolbox.backend.application.dto.TogglePremiumResponse;
import com.devtoolbox.backend.application.dto.ToggleStatusRequest;
import com.devtoolbox.backend.application.dto.ToggleStatusResponse;
import com.devtoolbox.backend.application.services.ToolService;
import com.devtoolbox.backend.data.entities.Tool;
import com.devtoolbox.backend.data.entities.Category;
import com.devtoolbox.backend.data.repositories.ToolRepository;
import com.devtoolbox.backend.data.repositories.CategoryRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.nio.file.Path;
import java.io.File;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    private final ToolService toolService;
    private final ToolRepository toolRepository;
    private final CategoryRepository categoryRepository;

    public AdminController(ToolService toolService, ToolRepository toolRepository, CategoryRepository categoryRepository) {
        this.toolService = toolService;
        this.toolRepository = toolRepository;
        this.categoryRepository = categoryRepository;
    }

    /**
     * API bật/tắt trạng thái công cụ
     */
    @PutMapping("/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleToolStatus(@RequestBody ToggleStatusRequest request) {
        try {
            Tool updatedTool = toolService.toggleToolStatus(request.getToolId(), request.getEnabled());
            
            ToggleStatusResponse response = new ToggleStatusResponse(
                updatedTool.getId(),
                updatedTool.getName(),
                updatedTool.getEnabled()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @PutMapping("/tools/{id}/toggle/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleToolStatusWithPath(
            @PathVariable("id") String id,
            @PathVariable("status") boolean status) {
        try {
            Tool updatedTool = toolService.toggleToolStatus(id, status);
            
            ToggleStatusResponse response = new ToggleStatusResponse(
                updatedTool.getId(),
                updatedTool.getName(),
                updatedTool.getEnabled()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * API để chuyển đổi trạng thái premium của công cụ
     */
    @PutMapping("/toggle-premium")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleToolPremium(@RequestBody TogglePremiumRequest request) {
        try {
            Tool updatedTool = toolService.toggleToolPremium(request.getToolId(), request.getIsPremium());
            
            TogglePremiumResponse response = new TogglePremiumResponse(
                updatedTool.getId(),
                updatedTool.getName(),
                updatedTool.getIsPremium()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Phiên bản API sử dụng PathVariable cho premium status
     */
    @PutMapping("/tools/{id}/premium/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleToolPremiumWithPath(
            @PathVariable("id") String id,
            @PathVariable("status") boolean status) {
        try {
            Tool updatedTool = toolService.toggleToolPremium(id, status);
            
            TogglePremiumResponse response = new TogglePremiumResponse(
                updatedTool.getId(),
                updatedTool.getName(),
                updatedTool.getIsPremium()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @Value("${app.plugin.directory}")
    private String pluginDirectory;
    
    @PostMapping("/tools/upload")
    public ResponseEntity<?> uploadTool(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("id") String id) {
        
        try {
            // Kiểm tra và tạo thư mục nếu chưa tồn tại
            File directory = new File(pluginDirectory);
            if (!directory.exists()) {
                boolean created = directory.mkdirs();
                if (!created) {
                    logger.error("Failed to create plugin directory: {}", pluginDirectory);
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "Không thể tạo thư mục plugin"));
                }
            }
            
            // Lưu file vào thư mục plugin
            String fileName = id + ".js";
            Path filePath = Path.of(pluginDirectory, fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            logger.info("File saved to: {}", filePath.toAbsolutePath());
            
            // Tìm hoặc tạo mới Category
            Category toolCategory;
            Optional<Category> existingCategory = Optional.ofNullable(categoryRepository.findByName(category));
            
            if (existingCategory.isPresent()) {
                toolCategory = existingCategory.get();
            } else {
                toolCategory = new Category();
                toolCategory.setName(category);
                categoryRepository.save(toolCategory);
            }

            // Lưu thông tin công cụ vào database
            Tool tool = new Tool();
            tool.setId(id);
            tool.setName(name);
            tool.setCategory(toolCategory);
            tool.setEnabled(true);
            tool.setIsPremium(false);
            toolRepository.save(tool);
            logger.info("Tool saved to database: {}", tool.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tải lên công cụ thành công");
            response.put("id", id);
            response.put("name", name);
            response.put("category", category);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error uploading tool", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Lỗi khi tải lên công cụ: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
