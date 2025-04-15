package com.devtoolbox.backend.application.services;

import java.util.Map;

public interface BenchmarkService {
    /**
     * Tạo một benchmark mới
     */
    Map<String, Object> createBenchmark(String unit);
    
    /**
     * Lấy thông tin benchmark theo ID
     */
    Map<String, Object> getBenchmark(String id);
    
    /**
     * Thêm suite mới vào benchmark
     */
    Map<String, Object> addSuite(String benchmarkId, String suiteName);
    
    /**
     * Thêm giá trị đo vào suite
     */
    boolean addMeasure(String benchmarkId, String suiteId, double value);
    
    /**
     * Xóa suite
     */
    boolean deleteSuite(String benchmarkId, String suiteId);
    
    /**
     * Cập nhật tên suite
     */
    Map<String, Object> updateSuiteName(String benchmarkId, String suiteId, String newName);
    
    /**
     * Cập nhật đơn vị đo
     */
    boolean updateUnit(String benchmarkId, String unit);
    
    /**
     * Xuất kết quả dưới dạng Markdown table
     */
    String exportAsMarkdown(String benchmarkId);
    
    /**
     * Xuất kết quả dưới dạng bullet list
     */
    String exportAsBulletList(String benchmarkId);
}