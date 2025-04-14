package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.QRCodeService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/tool/qr-code")
public class QRCodeController {

    private final QRCodeService qrCodeService;

    public QRCodeController(QRCodeService qrCodeService) {
        this.qrCodeService = qrCodeService;
    }

    @GetMapping("/generate")
    public ResponseEntity<byte[]> generateQRCode(
            @RequestParam String text,
            @RequestParam(defaultValue = "M") String errorCorrectionLevel) {
        try {
            ByteArrayOutputStream qrCodeStream = qrCodeService.generateQRCode(text, errorCorrectionLevel);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"qrcode.png\"")
                    .contentType(MediaType.IMAGE_PNG)
                    .body(qrCodeStream.toByteArray());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}