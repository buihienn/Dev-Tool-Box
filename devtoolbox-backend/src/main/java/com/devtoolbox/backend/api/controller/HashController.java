package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.HashService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/tool/hash")
@CrossOrigin(origins = "*")
public class HashController {

    private final HashService hashService;

    public HashController(HashService hashService) {
        this.hashService = hashService;
    }

    @GetMapping("/{encoding}")
    public Map<String, String> hashText(
            @PathVariable String encoding,
            @RequestParam String text
    ) {
        return hashService.generateHashes(text, encoding);
    }
}