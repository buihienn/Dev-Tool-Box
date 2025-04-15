package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.LoremIpsumService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tool/lorem-ipsum")
@CrossOrigin(origins = "*")
public class LoremIpsumController {
    
    private final LoremIpsumService loremIpsumService;
    
    public LoremIpsumController(LoremIpsumService loremIpsumService) {
        this.loremIpsumService = loremIpsumService;
    }
    
    @GetMapping("/generate")
    public ResponseEntity<String> generateLoremIpsum(
            @RequestParam(defaultValue = "3") int paragraphs,
            @RequestParam(defaultValue = "3") int minSentences,
            @RequestParam(defaultValue = "7") int maxSentences,
            @RequestParam(defaultValue = "5") int minWords,
            @RequestParam(defaultValue = "15") int maxWords,
            @RequestParam(defaultValue = "true") boolean startWithLorem,
            @RequestParam(defaultValue = "false") boolean asHtml
    ) {
        // Giới hạn các tham số để tránh tạo quá nhiều nội dung
        paragraphs = Math.min(Math.max(paragraphs, 1), 50);
        minSentences = Math.min(Math.max(minSentences, 1), 15);
        maxSentences = Math.min(Math.max(maxSentences, minSentences), 20);
        minWords = Math.min(Math.max(minWords, 3), 15);
        maxWords = Math.min(Math.max(maxWords, minWords), 30);
        
        String loremIpsum = loremIpsumService.generate(
                paragraphs,
                minSentences,
                maxSentences,
                minWords,
                maxWords,
                startWithLorem,
                asHtml
        );
        
        return ResponseEntity.ok(loremIpsum);
    }
}