package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.URLFormatterService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/tool/url-formatter")
public class URLFormatterController {

    private final URLFormatterService urlFormatterService;

    public URLFormatterController(URLFormatterService urlFormatterService) {
        this.urlFormatterService = urlFormatterService;
    }

    @PostMapping("/encode")
    public Map<String, String> encode(@RequestBody Map<String, String> request) {
        String input = request.get("text");
        String encoded = urlFormatterService.encode(input);
        Map<String, String> response = new HashMap<>();
        response.put("encoded", encoded);
        return response;
    }

    @PostMapping("/decode")
    public Map<String, String> decode(@RequestBody Map<String, String> request) {
        String input = request.get("text");
        String decoded = urlFormatterService.decode(input);
        Map<String, String> response = new HashMap<>();
        response.put("decoded", decoded);
        return response;
    }
}