package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.dto.TogglePremiumRequest;
import com.devtoolbox.backend.application.dto.TogglePremiumResponse;
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

}
