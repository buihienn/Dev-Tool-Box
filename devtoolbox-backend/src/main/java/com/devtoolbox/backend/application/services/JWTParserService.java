package com.devtoolbox.backend.application.services;

import java.util.Map;

public interface JWTParserService {
    Map<String, Object> parseJWT(String jwt);
}