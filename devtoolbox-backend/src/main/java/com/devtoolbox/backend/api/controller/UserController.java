package com.devtoolbox.backend.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.Collections;


import com.devtoolbox.backend.application.services.UserService;
import com.devtoolbox.backend.data.entities.User;

@RestController
@RequestMapping("api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/upgrade-premium")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> upgradePremium(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        userService.upgradePremium(currentUser.getId());
        return ResponseEntity.ok("Cập nhật premium thành công");
    }

    @GetMapping("/is-premium")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> isPremium(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        boolean isPremium = userService.isPremium(currentUser.getId());
        return ResponseEntity.ok(Collections.singletonMap("isPremium", isPremium));
    }
}
