package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.NatoAlphabetService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tool/nato-converter")
public class NatoAlphabetController {

    private final NatoAlphabetService natoAlphabetService;

    public NatoAlphabetController(NatoAlphabetService natoAlphabetService) {
        this.natoAlphabetService = natoAlphabetService;
    }

    @GetMapping("/convert")
    public String convertToNato(@RequestParam String text) {
        return natoAlphabetService.convertToNato(text);
    }
}