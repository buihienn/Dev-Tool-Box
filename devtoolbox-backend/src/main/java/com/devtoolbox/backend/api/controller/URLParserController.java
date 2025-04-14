package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.URLParserService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/tool/url-parser")
public class URLParserController {

    private final URLParserService urlParserService;

    public URLParserController(URLParserService urlParserService) {
        this.urlParserService = urlParserService;
    }

    @PostMapping("/parse")
    public Map<String, Object> parseURL(@RequestBody Map<String, String> request) {
        String urlString = request.get("url");
        return urlParserService.parseURL(urlString);
    }
}