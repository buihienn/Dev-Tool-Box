package com.devtoolbox.backend.application.services;

import java.util.Map;

public interface DynamicToolService {
    public Object invokeTool(String serviceName, String methodName, Map<String, Object> params) throws Exception;
    public Map<String, Object> getRegisteredServices();
    
}