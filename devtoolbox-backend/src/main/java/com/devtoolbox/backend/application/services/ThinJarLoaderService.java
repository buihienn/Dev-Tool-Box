package com.devtoolbox.backend.application.services;

import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

public interface ThinJarLoaderService {
    void loadJarFile(MultipartFile jarFile) throws Exception;
    Map<String, Object> getDynamicServices();
}
