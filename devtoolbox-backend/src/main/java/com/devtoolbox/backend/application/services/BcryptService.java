package com.devtoolbox.backend.application.services;

public interface BcryptService {

    String hashString(String inputString, int saltRounds);

    boolean compareStringWithHash(String inputString, String hash);
}