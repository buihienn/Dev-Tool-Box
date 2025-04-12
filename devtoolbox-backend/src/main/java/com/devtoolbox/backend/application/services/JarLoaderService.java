package com.devtoolbox.backend.application.services;

import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface JarLoaderService {
    void loadJarFile(MultipartFile jarFile) throws Exception;
    public Map<String, Object> getDynamicServices();
}
