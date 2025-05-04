package com.devtoolbox.backend.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Collections;


import com.devtoolbox.backend.application.services.UserService;

@RestController
@RequestMapping("api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/upgrade-premium")
    public ResponseEntity<?> upgradePremium(@RequestParam Long userId) {
        userService.upgradePremium(userId);
        return ResponseEntity.ok("Cập nhật premium thành công");
    }

    @GetMapping("/is-premium")
    public ResponseEntity<?> isPremium(@RequestParam Long userId) {
        boolean isPremium = userService.isPremium(userId);
        return ResponseEntity.ok(Collections.singletonMap("isPremium", isPremium));
    }
}