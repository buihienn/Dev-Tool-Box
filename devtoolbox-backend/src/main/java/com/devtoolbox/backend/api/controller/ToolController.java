package com.devtoolbox.backend.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.stream.Collectors;
import com.devtoolbox.backend.data.repositories.ToolRepository;
import com.devtoolbox.backend.application.dto.ToolResponse;

@RestController
@RequestMapping("/api/get-tool")
public class ToolController {

    private final ToolRepository toolRepository;

    public ToolController(ToolRepository toolRepository) {
        this.toolRepository = toolRepository;
    }

    @GetMapping("/all")
    public ResponseEntity<List<ToolResponse>> getAllTools() {
        List<ToolResponse> tools = toolRepository.findAll().stream()
            .map(tool -> new ToolResponse(
                tool.getId(),
                tool.getName(),
                tool.getCategory().getName(),
                tool.getIsNew(),
                tool.getIsPremium(),
                tool.getEnabled()
            ))
            .collect(Collectors.toList());

        return ResponseEntity.ok(tools);
    }
}