package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.URLFormatterService;
import org.springframework.stereotype.Service;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class URLFormatterServiceImpl implements URLFormatterService {

    @Override
    public String encode(String text) {
        try {
            return URLEncoder.encode(text, StandardCharsets.UTF_8.toString());
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to encode text", e);
        }
    }

    @Override
    public String decode(String text) {
        try {
            return URLDecoder.decode(text, StandardCharsets.UTF_8.toString());
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to decode text", e);
        }
    }
}