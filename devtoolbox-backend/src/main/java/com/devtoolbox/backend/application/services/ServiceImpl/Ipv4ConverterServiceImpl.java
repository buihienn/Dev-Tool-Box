package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.Ipv4ConverterService;
import org.springframework.stereotype.Service;

import java.net.Inet4Address;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;

@Service
public class Ipv4ConverterServiceImpl implements Ipv4ConverterService {

    @Override
    public Map<String, Object> convertIpv4Address(String ipAddress) {
        Map<String, Object> result = new HashMap<>();
        result.put("inputIp", ipAddress);
        
        try {
            // Validate địa chỉ IP
            InetAddress inetAddress = InetAddress.getByName(ipAddress);
            if (!(inetAddress instanceof Inet4Address)) {
                throw new IllegalArgumentException("Không phải địa chỉ IPv4 hợp lệ");
            }
            
            // Lấy byte array từ địa chỉ IP
            byte[] bytes = inetAddress.getAddress();
            
            // Chuyển đổi sang long (decimal)
            long decimal = 0;
            for (byte b : bytes) {
                decimal = decimal << 8 | (b & 0xFF);
            }
            
            // Chuyển đổi sang binary
            StringBuilder binary = new StringBuilder();
            for (byte b : bytes) {
                String bin = Integer.toBinaryString(b & 0xFF);
                // Đảm bảo mỗi octet có đủ 8 bit
                binary.append("00000000".substring(bin.length())).append(bin);
            }
            
            // Chuyển đổi sang hexadecimal
            StringBuilder hex = new StringBuilder();
            for (byte b : bytes) {
                String h = Integer.toHexString(b & 0xFF);
                // Đảm bảo mỗi byte có đủ 2 chữ số hex
                if (h.length() == 1) {
                    hex.append('0');
                }
                hex.append(h);
            }
            
            // Chuyển đổi sang IPv6 (IPv4-mapped IPv6 address)
            byte[] ipv6bytes = new byte[16];
            // Đặt 10 byte đầu tiên là 0
            for (int i = 0; i < 10; i++) {
                ipv6bytes[i] = 0;
            }
            // Đặt byte thứ 11 và 12 là 0xFF (để biểu thị IPv4-mapped IPv6)
            ipv6bytes[10] = (byte) 0xFF;
            ipv6bytes[11] = (byte) 0xFF;
            // Sao chép 4 byte của IPv4 vào 4 byte cuối
            System.arraycopy(bytes, 0, ipv6bytes, 12, 4);
            
            // Tạo địa chỉ IPv6
            InetAddress ipv6Address = Inet6Address.getByAddress(null, ipv6bytes);
            String ipv6Full = ipv6Address.getHostAddress();
            
            // Tạo phiên bản rút gọn của IPv6
            String ipv6Short = compressIPv6(ipv6Full);
            
            // Đặt kết quả vào map
            result.put("decimal", decimal);
            result.put("binary", binary.toString());
            result.put("hexadecimal", hex.toString().toUpperCase());
            result.put("ipv6", ipv6Full);
            result.put("ipv6Short", ipv6Short);
            result.put("valid", true);
            
        } catch (UnknownHostException | IllegalArgumentException e) {
            result.put("valid", false);
            result.put("error", "Địa chỉ IPv4 không hợp lệ: " + e.getMessage());
        } catch (Exception e) {
            result.put("valid", false);
            result.put("error", "Lỗi hệ thống: " + e.getMessage());
        }
        
        return result;
    }
    
    /**
     * Rút gọn địa chỉ IPv6 bằng cách thay thế chuỗi các số 0 bằng ::
     */
    private String compressIPv6(String ipv6) {
        // Đối với IPv4-mapped IPv6 address, biết trước dạng 0:0:0:0:0:ffff:w.x.y.z
        // Ta có thể rút gọn thành ::ffff:w.x.y.z
        
        // Nếu là IPv4-mapped IPv6 address đúng dạng
        if (ipv6.startsWith("0:0:0:0:0:ffff:")) {
            return "::" + ipv6.substring(ipv6.indexOf("ffff:"));
        }
        
        // Nếu không phải dạng chuẩn IPv4-mapped
        String[] parts = ipv6.split(":");
        
        // Tìm chuỗi dài nhất các số 0 liên tiếp
        int maxZeroStart = -1;
        int maxZeroLength = 0;
        int currentZeroStart = -1;
        int currentZeroLength = 0;
        
        for (int i = 0; i < parts.length; i++) {
            if (parts[i].equals("0")) {
                if (currentZeroStart == -1) {
                    currentZeroStart = i;
                    currentZeroLength = 1;
                } else {
                    currentZeroLength++;
                }
            } else {
                if (currentZeroStart != -1) {
                    if (currentZeroLength > maxZeroLength) {
                        maxZeroStart = currentZeroStart;
                        maxZeroLength = currentZeroLength;
                    }
                    currentZeroStart = -1;
                }
            }
        }
        
        // Kiểm tra nếu chuỗi kết thúc với các số 0
        if (currentZeroStart != -1 && currentZeroLength > maxZeroLength) {
            maxZeroStart = currentZeroStart;
            maxZeroLength = currentZeroLength;
        }
        
        // Nếu có chuỗi các số 0, thay thế bằng ::
        if (maxZeroLength > 1) {
            StringBuilder compressed = new StringBuilder();
            for (int i = 0; i < maxZeroStart; i++) {
                compressed.append(parts[i]).append(":");
            }
            compressed.append(":");
            for (int i = maxZeroStart + maxZeroLength; i < parts.length; i++) {
                compressed.append(parts[i]);
                if (i < parts.length - 1) {
                    compressed.append(":");
                }
            }
            return compressed.toString();
        }
        
        // Nếu không có chuỗi số 0 nào dài hơn 1, trả về nguyên bản
        return ipv6;
    }
}