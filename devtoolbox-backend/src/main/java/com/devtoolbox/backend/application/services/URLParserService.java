package com.devtoolbox.backend.application.services;

import java.util.Map;

public interface URLParserService {
    Map<String, Object> parseURL(String urlString);
}