package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.BenchmarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/tool/benchmark")
@CrossOrigin(origins = "*")
public class BenchmarkController {
    
    private final BenchmarkService benchmarkService;
    
    @Autowired
    public BenchmarkController(BenchmarkService benchmarkService) {
        this.benchmarkService = benchmarkService;
    }
    
    @PostMapping("/create")
    public ResponseEntity<?> createBenchmark(@RequestBody Map<String, String> request) {
        String unit = request.getOrDefault("unit", "ms");
        Map<String, Object> benchmark = benchmarkService.createBenchmark(unit);
        return ResponseEntity.ok(benchmark);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getBenchmark(@PathVariable String id) {
        Map<String, Object> benchmark = benchmarkService.getBenchmark(id);
        if (benchmark != null) {
            return ResponseEntity.ok(benchmark);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/{id}/suite")
    public ResponseEntity<?> addSuite(@PathVariable String id, @RequestBody Map<String, String> request) {
        String suiteName = request.getOrDefault("name", "New Suite");
        Map<String, Object> suite = benchmarkService.addSuite(id, suiteName);
        if (suite != null) {
            return ResponseEntity.ok(suite);
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid benchmark ID"));
    }
    
    @PostMapping("/{benchmarkId}/suite/{suiteId}/measure")
    public ResponseEntity<?> addMeasure(
            @PathVariable String benchmarkId,
            @PathVariable String suiteId,
            @RequestBody Map<String, Double> request) {
        
        Double value = request.get("value");
        if (value != null) {
            boolean success = benchmarkService.addMeasure(benchmarkId, suiteId, value);
            if (success) {
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid request"));
    }
    
    @DeleteMapping("/{benchmarkId}/suite/{suiteId}")
    public ResponseEntity<?> deleteSuite(
            @PathVariable String benchmarkId,
            @PathVariable String suiteId) {
        
        boolean success = benchmarkService.deleteSuite(benchmarkId, suiteId);
        if (success) {
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid request"));
    }
    
    @PutMapping("/{benchmarkId}/suite/{suiteId}")
    public ResponseEntity<?> updateSuiteName(
            @PathVariable String benchmarkId,
            @PathVariable String suiteId,
            @RequestBody Map<String, String> request) {
        
        String newName = request.get("name");
        if (newName != null) {
            Map<String, Object> updatedSuite = benchmarkService.updateSuiteName(benchmarkId, suiteId, newName);
            if (updatedSuite != null) {
                return ResponseEntity.ok(updatedSuite);
            }
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid request"));
    }
    
    @PutMapping("/{id}/unit")
    public ResponseEntity<?> updateUnit(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        
        String unit = request.get("unit");
        if (unit != null) {
            boolean success = benchmarkService.updateUnit(id, unit);
            if (success) {
                return ResponseEntity.ok(Map.of("success", true));
            }
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid request"));
    }
    
    @GetMapping("/{id}/export/markdown")
    public ResponseEntity<Map<String, String>> exportAsMarkdown(@PathVariable String id) {
        String markdown = benchmarkService.exportAsMarkdown(id);
        return ResponseEntity.ok(Map.of("markdown", markdown));
    }
    
    @GetMapping("/{id}/export/bulletlist")
    public ResponseEntity<Map<String, String>> exportAsBulletList(@PathVariable String id) {
        String bulletList = benchmarkService.exportAsBulletList(id);
        return ResponseEntity.ok(Map.of("bulletList", bulletList));
    }
}