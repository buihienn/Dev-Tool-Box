package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.DynamicToolService;
import com.devtoolbox.backend.application.services.JarLoaderService;
import com.devtoolbox.backend.application.services.ThinJarLoaderService;

import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.lang.reflect.Parameter;
import java.util.Map;
import java.util.HashMap;

@Service
public class DynamicToolServiceImpl implements DynamicToolService {

    @Override
    public Map<String, Object> getRegisteredServices() {
        Map<String, Object> services = new HashMap<>(jarLoaderService.getDynamicServices());
        services.putAll(thinJarLoaderService.getDynamicServices());
        return services;
    }

    private final JarLoaderService jarLoaderService;
    private final ThinJarLoaderService thinJarLoaderService;
    private final ObjectMapper objectMapper;

    public DynamicToolServiceImpl(
            JarLoaderService jarLoaderService,
            ThinJarLoaderService thinJarLoaderService,
            ObjectMapper objectMapper) {
        this.jarLoaderService = jarLoaderService;
        this.thinJarLoaderService = thinJarLoaderService;
        this.objectMapper = objectMapper;
    }

    @Override
    public Object invokeTool(String serviceName, String methodName, Map<String, Object> params) throws Exception {
        // Lấy danh sách dynamicServices từ JarLoaderService
        Map<String, Object> dynamicServices = getRegisteredServices();

        // Tìm service theo tên
        Object service = dynamicServices.get(serviceName);
        if (service == null) {
            throw new IllegalArgumentException("Service not found: " + serviceName);
        }

        // Tìm phương thức theo tên và tham số
        Method[] methods = service.getClass().getDeclaredMethods();
        for (Method method : methods) {
            if (Modifier.isPublic(method.getModifiers())
                    && method.getName().equals(methodName)
                    && method.getParameterCount() == params.size()) {
                // Gọi phương thức với các tham số
                Object[] args = extractArguments(method, params);
                return method.invoke(service, args);
            }
        }

        throw new IllegalArgumentException("Method not found: " + methodName + " in service: " + serviceName);
    }

    private Object[] extractArguments(Method method, Map<String, Object> params) {
        Parameter[] parameters = method.getParameters();
        Object[] args = new Object[parameters.length];
        for (int i = 0; i < parameters.length; i++) {
            String fallbackName = "arg" + i;
            String declaredName = parameters[i].getName();
            Object rawValue = params.containsKey(declaredName)
                    ? params.get(declaredName)
                    : params.get(fallbackName);

            if (rawValue == null && parameters[i].getType().isPrimitive()) {
                throw new IllegalArgumentException("Missing required parameter: " + fallbackName);
            }

            args[i] = objectMapper.convertValue(rawValue, parameters[i].getType());
        }
        return args;
    }
}
