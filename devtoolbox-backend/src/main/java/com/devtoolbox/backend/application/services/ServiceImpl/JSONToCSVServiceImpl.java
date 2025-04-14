package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.JSONToCSVService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class JSONToCSVServiceImpl implements JSONToCSVService {

    private final ObjectMapper objectMapper;

    public JSONToCSVServiceImpl() {
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public String convertToCSV(String rawJson) throws Exception {
        // Chuyển JSON sang danh sách các đối tượng
        List<Map<String, Object>> jsonList = objectMapper.readValue(rawJson, new com.fasterxml.jackson.core.type.TypeReference<List<Map<String, Object>>>() {});

        // Lấy tiêu đề (header) từ khóa của phần tử đầu tiên
        List<String> headers = jsonList.get(0).keySet().stream().collect(Collectors.toList());

        // Tạo CSV header
        StringBuilder csvBuilder = new StringBuilder(String.join(",", headers)).append("\n");

        // Tạo CSV rows
        for (Map<String, Object> row : jsonList) {
            String csvRow = headers.stream()
                    .map(header -> row.getOrDefault(header, "").toString())
                    .collect(Collectors.joining(","));
            csvBuilder.append(csvRow).append("\n");
        }

        return csvBuilder.toString();
    }
}