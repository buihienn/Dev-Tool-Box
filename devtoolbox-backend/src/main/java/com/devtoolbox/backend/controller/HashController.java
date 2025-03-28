package com.devtoolbox.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/hash")
@CrossOrigin(origins = "*")
public class HashController {

    @GetMapping("/{encoding}")
    public Map<String, String> hashText(
            @PathVariable String encoding,
            @RequestParam String text 
    ) {
        Map<String, String> hashResults = new HashMap<>();
        String[] algorithms = {"MD5", "SHA1", "SHA256", "SHA512"}; 

        for (String algorithm : algorithms) {
            try {
                MessageDigest digest = MessageDigest.getInstance(algorithm);
                byte[] hashBytes = digest.digest(text.getBytes());

                String encodedHash;
                switch (encoding.toLowerCase()) {
                    case "hex":
                        encodedHash = bytesToHex(hashBytes);
                        break;
                    case "binary":
                        encodedHash = bytesToBinary(hashBytes);
                        break;
                    case "base64url":
                        encodedHash = Base64.getUrlEncoder().encodeToString(hashBytes);
                        break;
                    case "base64":
                    default:
                        encodedHash = Base64.getEncoder().encodeToString(hashBytes);
                        break;
                }

                hashResults.put(algorithm, encodedHash);
            } catch (NoSuchAlgorithmException e) {
                hashResults.put(algorithm, "Error: Unsupported hash algorithm!");
            }
        }

        return hashResults;
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }

    private String bytesToBinary(byte[] bytes) {
        StringBuilder binaryString = new StringBuilder();
        for (byte b : bytes) {
            String binary = String.format("%8s", Integer.toBinaryString(b & 0xFF)).replace(' ', '0');
            binaryString.append(binary);
        }
        return binaryString.toString();
    }
}