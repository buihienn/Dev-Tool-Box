package com.devtoolbox.backend.application.services;

import java.util.Map;

public interface CreditCardService {
    Map<String, Object> validateAndParseCardNumber(String cardNumber, String expiryDate, String cvv);
    Map<String, Object> getCardExamples();
}