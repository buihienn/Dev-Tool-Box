package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.MacAddressService;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class MacAddressServiceImpl implements MacAddressService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final char[] HEX_CHARS_LOWER = "0123456789abcdef".toCharArray();
    private static final char[] HEX_CHARS_UPPER = "0123456789ABCDEF".toCharArray();
    private static final Pattern MAC_PREFIX_PATTERN = Pattern.compile("^([0-9A-Fa-f]{2}[:\\-\\.]?){0,5}$");

    @Override
    public List<String> generateMacAddresses(int quantity, String prefix, boolean uppercase, String separator) {
        List<String> macAddresses = new ArrayList<>();
        
        // Xác định số lượng tùy chỉnh
        int count = Math.min(Math.max(1, quantity), 1000); // Giới hạn từ 1-1000
        
        // Xử lý tiền tố
        String normalizedPrefix = normalizePrefix(prefix);
        int remainingOctets = 6 - (normalizedPrefix.length() / 2); // Số lượng octet cần tạo
        
        // Xác định ký tự phân cách
        String sep = determineSeparator(separator);
        
        // Sử dụng mảng ký tự hex thích hợp
        char[] hexChars = uppercase ? HEX_CHARS_UPPER : HEX_CHARS_LOWER;
        
        // Tạo các địa chỉ MAC
        for (int i = 0; i < count; i++) {
            StringBuilder macBuilder = new StringBuilder();
            
            // Thêm tiền tố nếu có
            if (!normalizedPrefix.isEmpty()) {
                for (int j = 0; j < normalizedPrefix.length(); j += 2) {
                    if (j > 0) {
                        macBuilder.append(sep);
                    }
                    macBuilder.append(normalizedPrefix.charAt(j));
                    macBuilder.append(normalizedPrefix.charAt(j + 1));
                }
            }
            
            // Tạo các octet còn lại
            for (int octet = 0; octet < remainingOctets; octet++) {
                if (!normalizedPrefix.isEmpty() || octet > 0) {
                    macBuilder.append(sep);
                }
                
                macBuilder.append(hexChars[RANDOM.nextInt(16)]);
                macBuilder.append(hexChars[RANDOM.nextInt(16)]);
            }
            
            macAddresses.add(macBuilder.toString());
        }
        
        return macAddresses;
    }
    
    @Override
    public Map<String, Object> validateMacPrefix(String prefix) {
        Map<String, Object> result = new HashMap<>();
        
        if (prefix == null || prefix.isEmpty()) {
            result.put("valid", true);
            result.put("normalizedPrefix", "");
            return result;
        }
        
        // Kiểm tra định dạng của tiền tố
        if (!MAC_PREFIX_PATTERN.matcher(prefix).matches()) {
            result.put("valid", false);
            result.put("error", "Tiền tố MAC không hợp lệ. Sử dụng định dạng như XX:XX:XX");
            return result;
        }
        
        // Tính số octet trong tiền tố
        String normalizedPrefix = normalizePrefix(prefix);
        int prefixOctets = normalizedPrefix.length() / 2;
        
        if (prefixOctets > 5) {
            result.put("valid", false);
            result.put("error", "Tiền tố quá dài. Tối đa 5 octet (10 ký tự hex)");
            return result;
        }
        
        result.put("valid", true);
        result.put("normalizedPrefix", normalizedPrefix);
        result.put("octets", prefixOctets);
        result.put("remainingOctets", 6 - prefixOctets);
        
        return result;
    }
    
    /**
     * Chuẩn hóa tiền tố MAC bằng cách loại bỏ tất cả dấu phân cách
     */
    private String normalizePrefix(String prefix) {
        if (prefix == null || prefix.isEmpty()) {
            return "";
        }
        
        // Loại bỏ tất cả dấu phân cách
        return prefix.replaceAll("[:\\-\\.]", "");
    }
    
    /**
     * Xác định dấu phân cách dựa trên tham số
     */
    private String determineSeparator(String separator) {
        if (separator == null || separator.isEmpty()) {
            return ":";  // Mặc định là dấu hai chấm
        }
        
        switch (separator.toLowerCase()) {
            case "colon":
            case ":":
                return ":";
            case "hyphen":
            case "-":
                return "-";
            case "dot":
            case ".":
                return ".";
            case "none":
                return "";
            default:
                return ":";  // Mặc định là dấu hai chấm
        }
    }
}