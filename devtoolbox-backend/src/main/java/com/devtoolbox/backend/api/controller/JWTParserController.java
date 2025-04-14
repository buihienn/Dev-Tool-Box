package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.JWTParserService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/tool/jwt-parser")
public class JWTParserController {

    private final JWTParserService jwtParserService;

    public JWTParserController(JWTParserService jwtParserService) {
        this.jwtParserService = jwtParserService;
    }

    @PostMapping("/parse")
    public Map<String, Object> parseJWT(@RequestBody Map<String, String> request) {
        String jwt = request.get("jwt");
        return jwtParserService.parseJWT(jwt);
    }
}