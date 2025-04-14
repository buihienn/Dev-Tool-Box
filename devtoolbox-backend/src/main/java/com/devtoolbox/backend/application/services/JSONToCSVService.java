package com.devtoolbox.backend.application.services;

public interface JSONToCSVService {
    String convertToCSV(String rawJson) throws Exception;
}