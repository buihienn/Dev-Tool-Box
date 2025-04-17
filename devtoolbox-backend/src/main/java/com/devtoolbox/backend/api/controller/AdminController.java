package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.dto.ToggleStatusRequest;
import com.devtoolbox.backend.application.dto.ToggleStatusResponse;
import com.devtoolbox.backend.application.services.ToolService;
import com.devtoolbox.backend.data.entities.Tool;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ToolService toolService;

    public AdminController(ToolService toolService) {
        this.toolService = toolService;
    }

    /**
     * API bật/tắt trạng thái công cụ
     */
    @PutMapping("/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleToolStatus(@RequestBody ToggleStatusRequest request) {
        try {
            // Đảm bảo sử dụng đúng getter để lấy giá trị enabled
            Tool updatedTool = toolService.toggleToolStatus(request.getToolId(), request.getEnabled());
            
            // Tạo response, sử dụng getEnabled() thay vì isEnabled()
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
     * Phiên bản API sử dụng PathVariable
     */
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
}
