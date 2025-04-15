package com.devtoolbox.backend.application.services;

import java.util.List;
import java.util.Map;

public interface MacAddressService {
    List<String> generateMacAddresses(int quantity, String prefix, boolean uppercase, String separator);
    Map<String, Object> validateMacPrefix(String prefix);
}