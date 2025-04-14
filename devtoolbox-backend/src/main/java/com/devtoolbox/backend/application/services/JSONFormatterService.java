package com.devtoolbox.backend.application.services;

public interface JSONFormatterService {
    String formatJSON(String rawJson, int indentSize) throws Exception;
}