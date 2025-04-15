package com.devtoolbox.backend.application.services;

import java.util.Map;

public interface TextStatisticsService {
    Map<String, Object> analyzeText(String text);
}