package com.devtoolbox.backend.application.services;


import org.springframework.security.core.userdetails.UserDetails;

public interface JWTService {
    String extractUserName(String token);

    String generateToken(UserDetails userDetails, String role, Long userId);

    boolean isTokenValid(String token, UserDetails userDetails);

    boolean isTokenExpired(String token);
}

