package com.devtoolbox.backend.application.services;

public interface NumeronymService {
    String generateNumeronym(String input);
    String generateSentenceNumeronyms(String sentence);
}