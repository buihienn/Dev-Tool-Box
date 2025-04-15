package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.DockerComposeConverterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/tool/docker-compose-converter")
public class DockerComposeConverterController {

    private final DockerComposeConverterService converterService;

    public DockerComposeConverterController(DockerComposeConverterService converterService) {
        this.converterService = converterService;
    }

    @PostMapping("/convert")
    public ResponseEntity<String> convertDockerRunToCompose(@RequestBody Map<String, String> requestBody) {
        try {
            String dockerRunCommand = requestBody.get("dockerRunCommand");
            String dockerComposeContent = converterService.convertToCompose(dockerRunCommand);
            return ResponseEntity.ok(dockerComposeContent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid Docker run command.");
        }
    }
}