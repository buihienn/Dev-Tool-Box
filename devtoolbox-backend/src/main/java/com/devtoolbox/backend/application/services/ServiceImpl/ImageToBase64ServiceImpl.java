package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.ImageToBase64Service;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;

@Service
public class ImageToBase64ServiceImpl implements ImageToBase64Service {

    @Override
    public String convertToBase64(MultipartFile file) throws Exception {
        byte[] fileBytes = file.getBytes();
        return Base64.getEncoder().encodeToString(fileBytes); // Chỉ trả về dữ liệu Base64
    }

    @Override
    public String convertToHTML(MultipartFile file) throws Exception {
        String base64 = convertToBase64(file);
        return "<img src=\"data:" + file.getContentType() + ";base64," + base64 + "\" alt=\"Base64 Image\" />";
    }
}