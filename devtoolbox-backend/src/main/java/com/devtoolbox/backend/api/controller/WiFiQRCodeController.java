package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.QRCodeService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/tool/wifi-qr-code")
public class WiFiQRCodeController {

    private final QRCodeService qrCodeService;

    public WiFiQRCodeController(QRCodeService qrCodeService) {
        this.qrCodeService = qrCodeService;
    }

    @GetMapping("/generate")
    public ResponseEntity<byte[]> generateWiFiQRCode(
            @RequestParam String ssid,
            @RequestParam String password,
            @RequestParam(defaultValue = "false") boolean hidden) {
        try {
            // Tạo chuỗi WiFi QR Code theo định dạng chuẩn
            String wifiConfig = String.format("WIFI:T:WPA;S:%s;P:%s;H:%s;;", ssid, password, hidden ? "true" : "false");

            ByteArrayOutputStream qrCodeStream = qrCodeService.generateQRCode(wifiConfig, "M");

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"wifi-qrcode.png\"")
                    .contentType(MediaType.IMAGE_PNG)
                    .body(qrCodeStream.toByteArray());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}