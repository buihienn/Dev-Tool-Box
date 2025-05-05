package com.devtoolbox.backend.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;
import java.util.stream.Collectors;
import com.devtoolbox.backend.application.dto.ToolResponse;
import com.devtoolbox.backend.application.services.ToolService;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/doTool")
public class ToolController {

    private final ToolService toolService;

    @Autowired
    public ToolController(ToolService toolService) {
        this.toolService = toolService;
    }

    // Lấy danh sách tất cả công cụ
    @GetMapping("/getAll")
    public ResponseEntity<List<ToolResponse>> getAllTools() {
        List<ToolResponse> tools = toolService.getAllTools().stream()
            .map(tool -> new ToolResponse(
                tool.getId(),
                tool.getName(),
                tool.getDescription(),
                tool.getCategory().getName(),
                tool.getIsNew(),
                tool.getIsPremium(),
                tool.getEnabled()
            ))
            .collect(Collectors.toList());

        return ResponseEntity.ok(tools);
    }

    @DeleteMapping("/deletById/{id}")
    public ResponseEntity<?> deleteTool(@PathVariable String id) {
        try {
            toolService.deleteToolById(id);
            return ResponseEntity.ok("Tool deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting tool: " + e.getMessage());
        }
    }
}