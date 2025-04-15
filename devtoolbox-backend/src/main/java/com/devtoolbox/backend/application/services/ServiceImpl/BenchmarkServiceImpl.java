package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.BenchmarkService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class BenchmarkServiceImpl implements BenchmarkService {
    
    // Lưu trữ tạm thời cho benchmark data
    private final Map<String, Map<String, Object>> benchmarks = new ConcurrentHashMap<>();
    
    @Override
    public Map<String, Object> createBenchmark(String unit) {
        String benchmarkId = UUID.randomUUID().toString();
        
        Map<String, Object> benchmark = new HashMap<>();
        benchmark.put("id", benchmarkId);
        benchmark.put("unit", unit);
        benchmark.put("suites", new ArrayList<>());
        
        benchmarks.put(benchmarkId, benchmark);
        
        return benchmark;
    }
    
    @Override
    public Map<String, Object> getBenchmark(String id) {
        return benchmarks.get(id);
    }
    
    @Override
    public Map<String, Object> addSuite(String benchmarkId, String suiteName) {
        Map<String, Object> benchmark = benchmarks.get(benchmarkId);
        if (benchmark == null) {
            return null;
        }
        
        Map<String, Object> newSuite = new HashMap<>();
        newSuite.put("id", UUID.randomUUID().toString());
        newSuite.put("name", suiteName);
        newSuite.put("measures", new ArrayList<>());
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> suites = (List<Map<String, Object>>) benchmark.get("suites");
        suites.add(newSuite);
        
        return newSuite;
    }
    
    @Override
    public boolean addMeasure(String benchmarkId, String suiteId, double value) {
        Map<String, Object> benchmark = benchmarks.get(benchmarkId);
        if (benchmark == null) {
            return false;
        }
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> suites = (List<Map<String, Object>>) benchmark.get("suites");
        
        for (Map<String, Object> suite : suites) {
            if (suiteId.equals(suite.get("id"))) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> measures = (List<Map<String, Object>>) suite.get("measures");
                
                Map<String, Object> newMeasure = new HashMap<>();
                newMeasure.put("id", UUID.randomUUID().toString());
                newMeasure.put("value", value);
                
                measures.add(newMeasure);
                return true;
            }
        }
        
        return false;
    }
    
    @Override
    public boolean deleteSuite(String benchmarkId, String suiteId) {
        Map<String, Object> benchmark = benchmarks.get(benchmarkId);
        if (benchmark == null) {
            return false;
        }
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> suites = (List<Map<String, Object>>) benchmark.get("suites");
        
        return suites.removeIf(suite -> suiteId.equals(suite.get("id")));
    }
    
    @Override
    public Map<String, Object> updateSuiteName(String benchmarkId, String suiteId, String newName) {
        Map<String, Object> benchmark = benchmarks.get(benchmarkId);
        if (benchmark == null) {
            return null;
        }
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> suites = (List<Map<String, Object>>) benchmark.get("suites");
        
        for (Map<String, Object> suite : suites) {
            if (suiteId.equals(suite.get("id"))) {
                suite.put("name", newName);
                return suite;
            }
        }
        
        return null;
    }
    
    @Override
    public boolean updateUnit(String benchmarkId, String unit) {
        Map<String, Object> benchmark = benchmarks.get(benchmarkId);
        if (benchmark == null) {
            return false;
        }
        
        benchmark.put("unit", unit);
        return true;
    }
    
    @Override
    public String exportAsMarkdown(String benchmarkId) {
        Map<String, Object> benchmark = benchmarks.get(benchmarkId);
        if (benchmark == null) {
            return "Benchmark not found";
        }
        
        String unit = (String) benchmark.get("unit");
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> suites = (List<Map<String, Object>>) benchmark.get("suites");
        
        // Sắp xếp suite theo trung bình
        List<Map<String, Object>> sortedSuites = new ArrayList<>(suites);
        sortedSuites.sort((a, b) -> {
            double meanA = calculateMean((List<Map<String, Object>>) a.get("measures"));
            double meanB = calculateMean((List<Map<String, Object>>) b.get("measures"));
            return Double.compare(meanA, meanB);
        });
        
        StringBuilder sb = new StringBuilder();
        sb.append("| Position | Suite | Samples | Mean | Variance |\n");
        sb.append("| -------- | ----- | ------- | ---- | -------- |\n");
        
        for (int i = 0; i < sortedSuites.size(); i++) {
            Map<String, Object> suite = sortedSuites.get(i);
            String name = (String) suite.get("name");
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> measures = (List<Map<String, Object>>) suite.get("measures");
            
            double mean = calculateMean(measures);
            double variance = calculateVariance(measures);
            int samples = measures.size();
            
            sb.append(String.format("| %d | %s | %d | %.2f %s | %.2f %s² |\n",
                i + 1, name, samples, mean, unit, variance, unit));
        }
        
        return sb.toString();
    }
    
    @Override
    public String exportAsBulletList(String benchmarkId) {
        Map<String, Object> benchmark = benchmarks.get(benchmarkId);
        if (benchmark == null) {
            return "Benchmark not found";
        }
        
        String unit = (String) benchmark.get("unit");
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> suites = (List<Map<String, Object>>) benchmark.get("suites");
        
        // Sắp xếp suite theo trung bình
        List<Map<String, Object>> sortedSuites = new ArrayList<>(suites);
        sortedSuites.sort((a, b) -> {
            double meanA = calculateMean((List<Map<String, Object>>) a.get("measures"));
            double meanB = calculateMean((List<Map<String, Object>>) b.get("measures"));
            return Double.compare(meanA, meanB);
        });
        
        StringBuilder sb = new StringBuilder();
        
        for (int i = 0; i < sortedSuites.size(); i++) {
            Map<String, Object> suite = sortedSuites.get(i);
            String name = (String) suite.get("name");
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> measures = (List<Map<String, Object>>) suite.get("measures");
            
            double mean = calculateMean(measures);
            double variance = calculateVariance(measures);
            int samples = measures.size();
            
            sb.append(String.format("- %d. %s: %.2f %s (±%.2f %s²) [%d samples]\n",
                i + 1, name, mean, unit, variance, unit, samples));
        }
        
        return sb.toString();
    }
    
    // Helper method để tính trung bình
    private double calculateMean(List<Map<String, Object>> measures) {
        if (measures == null || measures.isEmpty()) {
            return 0;
        }
        
        double sum = 0;
        for (Map<String, Object> measure : measures) {
            sum += ((Number) measure.get("value")).doubleValue();
        }
        
        return sum / measures.size();
    }
    
    // Helper method để tính phương sai
    private double calculateVariance(List<Map<String, Object>> measures) {
        if (measures == null || measures.size() <= 1) {
            return 0;
        }
        
        double mean = calculateMean(measures);
        double sumSquaredDiffs = 0;
        
        for (Map<String, Object> measure : measures) {
            double diff = ((Number) measure.get("value")).doubleValue() - mean;
            sumSquaredDiffs += diff * diff;
        }
        
        return sumSquaredDiffs / measures.size();
    }
}