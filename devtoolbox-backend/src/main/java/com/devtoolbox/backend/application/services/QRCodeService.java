package com.devtoolbox.backend.application.services;

import java.io.ByteArrayOutputStream;

public interface QRCodeService {
    ByteArrayOutputStream generateQRCode(String text, String errorCorrectionLevel) throws Exception;
}