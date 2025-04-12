package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.DynamicToolService;
import com.devtoolbox.backend.application.services.JarLoaderService;

import org.springframework.stereotype.Service;

import java.lang.reflect.Method;
import java.util.Map;

@Service
public class DynamicToolServiceImpl implements DynamicToolService {

    @Override
    public Map<String, Object> getRegisteredServices() {
        return jarLoaderService.getDynamicServices();
    }

    private final JarLoaderService jarLoaderService;

    public DynamicToolServiceImpl(JarLoaderService jarLoaderService) {
        this.jarLoaderService = jarLoaderService;
    }

    @Override
    public Object invokeTool(String serviceName, String methodName, Map<String, Object> params) throws Exception {
        // Lấy danh sách dynamicServices từ JarLoaderService
        Map<String, Object> dynamicServices = jarLoaderService.getDynamicServices();

        // Tìm service theo tên
        Object service = dynamicServices.get(serviceName);
        if (service == null) {
            throw new IllegalArgumentException("Service not found: " + serviceName);
        }

        // Tìm phương thức theo tên và tham số
        Method[] methods = service.getClass().getMethods();
        for (Method method : methods) {
            if (method.getName().equals(methodName)) {
                // Gọi phương thức với các tham số
                Object[] args = extractArguments(method, params);
                return method.invoke(service, args);
            }
        }

        throw new IllegalArgumentException("Method not found: " + methodName + " in service: " + serviceName);
    }

    private Object[] extractArguments(Method method, Map<String, Object> params) {
        Class<?>[] parameterTypes = method.getParameterTypes();
        Object[] args = new Object[parameterTypes.length];
        for (int i = 0; i < parameterTypes.length; i++) {
            String paramName = "arg" + i; // Tham số được truyền theo thứ tự arg0, arg1, ...
            args[i] = params.getOrDefault(paramName, null);
        }
        return args;
    }
}