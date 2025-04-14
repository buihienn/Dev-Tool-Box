package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.JWTParserService;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class JWTParserServiceImpl implements JWTParserService {

    @Override
    public Map<String, Object> parseJWT(String jwt) {
        Map<String, Object> result = new HashMap<>();
        try {
            String[] parts = jwt.split("\\.");
            if (parts.length != 3) {
                throw new IllegalArgumentException("Invalid JWT format");
            }

            // Decode Header
            String headerJson = new String(Base64.getUrlDecoder().decode(parts[0]));
            result.put("header", headerJson);

            // Decode Payload
            String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]));
            result.put("payload", payloadJson);

        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to parse JWT", e);
        }
        return result;
    }
}