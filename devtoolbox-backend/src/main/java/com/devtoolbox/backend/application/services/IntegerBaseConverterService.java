package com.devtoolbox.backend.application.services;

import java.util.Map;

public interface IntegerBaseConverterService {
    Map<String, String> convertBase(String inputNumber, int inputBase);
}
