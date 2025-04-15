package com.devtoolbox.backend.application.services;

import java.util.Map;

public interface PhoneParserService {
    Map<String, Object> parsePhoneNumber(String phoneNumber, String countryCode);
    Map<String, Object> getSupportedCountries();
}