package com.devtoolbox.backend.application.services;

import java.util.Map;

public interface Ipv4ConverterService {
    Map<String, Object> convertIpv4Address(String ipAddress);
}