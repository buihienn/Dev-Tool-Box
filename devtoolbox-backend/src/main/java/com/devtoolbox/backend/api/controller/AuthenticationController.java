package com.devtoolbox.backend.api.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.devtoolbox.backend.application.dto.LoginRequest;
import com.devtoolbox.backend.application.dto.SignUpRequest;
import com.devtoolbox.backend.application.services.AuthenticationService;
import com.devtoolbox.backend.data.entities.User;

@RestController
@RequestMapping("api/auth")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignUpRequest signUpRequest) {
        try {
            User user = authenticationService.signup(signUpRequest);
            return ResponseEntity.ok(Map.of(
                "message", "Signup successful",
                "user", user
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Map<String, Object> response = authenticationService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @RequestMapping(value = "/verify", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        try {
            authenticationService.verifyEmail(token);
            return ResponseEntity.ok(Map.of("message", "Email verified successfully!"));
        } catch (IllegalArgumentException e) {
            if (e.getMessage().equals("Token has expired!")) {
                return ResponseEntity.status(HttpStatus.GONE).body(Map.of("message", e.getMessage()));
            }
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerificationEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        try {
            authenticationService.resendVerificationEmail(email);
            return ResponseEntity.ok(Map.of("message", "Verification email sent successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required!"));
        }

        try {
            authenticationService.forgotPassword(email);
            return ResponseEntity.ok(Map.of("message", "Password reset email sent successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "An unexpected error occurred. Please try again later."));
        }
    }
}  
