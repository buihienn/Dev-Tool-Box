package com.devtoolbox.backend.application.services;


import org.springframework.security.core.userdetails.UserDetails;

public interface JWTService {
    String extractUserName(String token);

    String generateToken(UserDetails userDetails, String role, Long userId); // Cập nhật phương thức

    boolean isTokenValid(String token, UserDetails userDetails);

    boolean isTokenExpired(String token);
}

