package com.devtoolbox.backend.application.services;

import java.util.Map;

public interface HashService {
    Map<String, String> generateHashes(String text, String encoding);
}