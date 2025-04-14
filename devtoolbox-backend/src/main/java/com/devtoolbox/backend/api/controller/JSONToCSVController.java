package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.JSONToCSVService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/tool/json-to-csv")
public class JSONToCSVController {

    private final JSONToCSVService jsonToCSVService;

    public JSONToCSVController(JSONToCSVService jsonToCSVService) {
        this.jsonToCSVService = jsonToCSVService;
    }

    @PostMapping("/convert")
    public ResponseEntity<String> convertJSONToCSV(@RequestBody Map<String, Object> requestBody) {
        try {
            String rawJson = (String) requestBody.get("rawJson");
            String csv = jsonToCSVService.convertToCSV(rawJson);
            return ResponseEntity.ok(csv);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid JSON input.");
        }
    }
}