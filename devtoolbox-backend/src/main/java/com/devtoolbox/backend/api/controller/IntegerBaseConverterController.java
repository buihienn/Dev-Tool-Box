package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.IntegerBaseConverterService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/tool/base-converter")
public class IntegerBaseConverterController {

    private final IntegerBaseConverterService baseConverterService;

    public IntegerBaseConverterController(IntegerBaseConverterService baseConverterService) {
        this.baseConverterService = baseConverterService;
    }

    @GetMapping("/convert")
    public Map<String, String> convertBase(
            @RequestParam String inputNumber,
            @RequestParam int inputBase
    ) {
        return baseConverterService.convertBase(inputNumber, inputBase);
    }
}