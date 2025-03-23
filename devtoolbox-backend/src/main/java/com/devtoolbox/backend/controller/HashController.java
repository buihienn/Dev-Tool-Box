package com.devtoolbox.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/hash")
@CrossOrigin(origins = "*")
public class HashController {

    @GetMapping("/{algorithm}")
    public String hashText(@PathVariable String algorithm, @RequestParam String text) {
        try {
            MessageDigest digest = MessageDigest.getInstance(algorithm);
            byte[] hashBytes = digest.digest(text.getBytes());
            return Base64.getEncoder().encodeToString(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            return "Error: Unsupported hash algorithm!";
        }
    }
}