package com.devtoolbox.backend.application.services;

import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService {
    UserDetailsService userDetailsService();
    void upgradePremium(Long userId);
    boolean isPremium(Long userId);
}