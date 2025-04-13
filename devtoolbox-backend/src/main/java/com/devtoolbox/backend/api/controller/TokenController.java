package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.TokenService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tool/token")
@CrossOrigin(origins = "*")
public class TokenController {

    private final TokenService tokenService;

    public TokenController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @GetMapping("/generate")
    public String generateToken(
            @RequestParam(required = false, defaultValue = "true") boolean uppercase,
            @RequestParam(required = false, defaultValue = "true") boolean lowercase,
            @RequestParam(required = false, defaultValue = "true") boolean numbers,
            @RequestParam(required = false, defaultValue = "true") boolean symbols,
            @RequestParam(required = false, defaultValue = "64") int length) {
        return tokenService.generateToken(uppercase, lowercase, numbers, symbols, length);
    }
}