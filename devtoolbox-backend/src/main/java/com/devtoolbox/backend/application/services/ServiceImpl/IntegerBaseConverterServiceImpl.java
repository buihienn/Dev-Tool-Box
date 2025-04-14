package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.IntegerBaseConverterService;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;

@Service
public class IntegerBaseConverterServiceImpl implements IntegerBaseConverterService {

    @Override
    public Map<String, String> convertBase(String inputNumber, int inputBase) {
        try {
            // Sử dụng BigInteger để xử lý số lớn
            BigInteger number = new BigInteger(inputNumber, inputBase);

            Map<String, String> result = new HashMap<>();
            result.put("binary", number.toString(2)); // Chuyển đổi sang nhị phân
            result.put("octal", number.toString(8)); // Chuyển đổi sang bát phân
            result.put("decimal", number.toString(10)); // Chuyển đổi sang thập phân
            result.put("hexadecimal", number.toString(16)); // Chuyển đổi sang thập lục phân
            result.put("base64", encodeBase64(number)); // Chuyển đổi sang Base64

            return result;
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid input number or base.");
        }
    }

    private String encodeBase64(BigInteger number) {
        // Chuyển đổi BigInteger sang Base64
        byte[] numberBytes = number.toByteArray();
        return java.util.Base64.getEncoder().encodeToString(numberBytes);
    }
}