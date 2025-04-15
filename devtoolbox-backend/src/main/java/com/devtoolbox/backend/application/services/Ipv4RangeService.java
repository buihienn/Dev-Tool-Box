package com.devtoolbox.backend.application.services;

import java.util.Map;

public interface Ipv4RangeService {
    Map<String, Object> calculateIpv4Range(String startIp, String endIp);
}