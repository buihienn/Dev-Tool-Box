package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.QRCodeService;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;
import javax.imageio.ImageIO;

@Service
public class QRCodeServiceImpl implements QRCodeService {

    @Override
    public ByteArrayOutputStream generateQRCode(String text, String errorCorrectionLevel) throws Exception {
        int size = 256;

        // Map error correction level
        ErrorCorrectionLevel level = switch (errorCorrectionLevel.toUpperCase()) {
            case "L" -> ErrorCorrectionLevel.L;
            case "Q" -> ErrorCorrectionLevel.Q;
            case "H" -> ErrorCorrectionLevel.H;
            default -> ErrorCorrectionLevel.M;
        };

        // QR Code Writer
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.ERROR_CORRECTION, level);

        var bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, size, size, hints);

        // Create BufferedImage (default: black and white)
        BufferedImage image = new BufferedImage(size, size, BufferedImage.TYPE_INT_RGB);
        for (int x = 0; x < size; x++) {
            for (int y = 0; y < size; y++) {
                image.setRGB(x, y, bitMatrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF); // Black and White
            }
        }

        // Write image to ByteArrayOutputStream
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(image, "png", outputStream);
        return outputStream;
    }
}