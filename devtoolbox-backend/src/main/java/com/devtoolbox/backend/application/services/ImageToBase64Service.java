package com.devtoolbox.backend.application.services;

import org.springframework.web.multipart.MultipartFile;

public interface ImageToBase64Service {
    String convertToBase64(MultipartFile file) throws Exception;
    String convertToHTML(MultipartFile file) throws Exception;
}