package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.XMLToJSONService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tool/xml-to-json")
public class XMLToJSONController {

    private final XMLToJSONService xmlToJsonService;

    public XMLToJSONController(XMLToJSONService xmlToJsonService) {
        this.xmlToJsonService = xmlToJsonService;
    }

    @PostMapping("/convert")
    public ResponseEntity<?> convertXMLToJSON(@RequestBody String xmlContent) {
        try {
            String json = xmlToJsonService.convertXMLToJSON(xmlContent);
            return ResponseEntity.ok(json);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid XML input.");
        }
    }
}