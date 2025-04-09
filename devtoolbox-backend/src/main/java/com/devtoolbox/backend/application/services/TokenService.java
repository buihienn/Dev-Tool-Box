package com.devtoolbox.backend.application.services;

public interface TokenService {
    String generateToken(boolean uppercase, boolean lowercase, boolean numbers, boolean symbols, int length);
}