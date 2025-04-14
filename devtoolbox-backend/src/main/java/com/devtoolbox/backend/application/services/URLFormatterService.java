package com.devtoolbox.backend.application.services;

public interface URLFormatterService {
    String encode(String text);
    String decode(String text);
}