package com.devtoolbox.backend.application.services;

import java.util.Map;

public interface IbanService {
    Map<String, Object> validateAndParseIban(String iban);
    Map<String, Object> getIbanExamples();
}