package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.Ipv4RangeService;
import org.springframework.stereotype.Service;

import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.ByteBuffer;
import java.util.HashMap;
import java.util.Map;

@Service
public class Ipv4RangeServiceImpl implements Ipv4RangeService {

    @Override
    public Map<String, Object> calculateIpv4Range(String startIp, String endIp) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Validate và chuyển đổi địa chỉ IP
            InetAddress startAddress = InetAddress.getByName(startIp);
            InetAddress endAddress = InetAddress.getByName(endIp);
            
            // Kiểm tra xem đây có phải là IPv4 không
            if (!(startAddress instanceof Inet4Address) || !(endAddress instanceof Inet4Address)) {
                throw new IllegalArgumentException("Cần địa chỉ IPv4 hợp lệ");
            }
            
            // Lưu giá trị đầu vào ban đầu
            result.put("originalStartIp", startIp);
            result.put("originalEndIp", endIp);
            
            // Chuyển đổi địa chỉ IP thành số long để tính toán
            long startIpLong = ipToLong(startAddress.getAddress());
            long endIpLong = ipToLong(endAddress.getAddress());
            
            // Kiểm tra xem startIp có nhỏ hơn endIp không
            if (startIpLong > endIpLong) {
                throw new IllegalArgumentException("Địa chỉ bắt đầu phải nhỏ hơn địa chỉ kết thúc");
            }
            
            // Tính toán kích thước ban đầu của dải địa chỉ
            long originalSize = Long.valueOf(endIpLong - startIpLong + 1);
            result.put("originalAddressCount", originalSize);
            
            // Tính toán CIDR và kích thước mạng mới
            int cidrPrefixLength = calculateOptimalCIDR(startIpLong, endIpLong);
            
            // Tìm địa chỉ mạng (network address) với CIDR đã cho
            long networkMask = 0xFFFFFFFFl & (0xFFFFFFFFl << (32 - cidrPrefixLength));
            long networkAddressLong = startIpLong & networkMask;
            
            // Sửa cách tính broadcast để tránh lỗi bit operation
            long invertedMask = 0xFFFFFFFFl & (~networkMask);
            long broadcastAddressLong = networkAddressLong | invertedMask;
            
            // Định dạng CIDR
            String networkAddress = longToIp(networkAddressLong);
            String cidrNotation = networkAddress + "/" + cidrPrefixLength;
            
            // Tính kích thước mạng mới
            long newSize = Long.valueOf(broadcastAddressLong - networkAddressLong + 1);
            
            // Đặt kết quả (giữ lại các thông tin cơ bản, bỏ phần thông tin thêm)
            result.put("newStartIp", networkAddress);
            result.put("newEndIp", longToIp(broadcastAddressLong));
            result.put("cidr", cidrNotation);
            result.put("newAddressCount", newSize);
            result.put("prefixLength", cidrPrefixLength);
            result.put("valid", true);
            
            // Bỏ các thông tin thêm: netmask, broadcast, firstUsableIp, lastUsableIp, usableHosts
            
        } catch (UnknownHostException | IllegalArgumentException e) {
            result.put("valid", false);
            result.put("error", "Lỗi: " + e.getMessage());
        } catch (Exception e) {
            result.put("valid", false);
            result.put("error", "Lỗi không xác định: " + e.getMessage());
        }
        
        return result;
    }
    
    /**
     * Chuyển đổi mảng byte IP thành số long
     */
    private long ipToLong(byte[] bytes) {
        ByteBuffer buffer = ByteBuffer.allocate(8);
        buffer.put(new byte[]{0, 0, 0, 0}); // Padding 4 byte đầu tiên với 0
        buffer.put(bytes);  // Thêm 4 byte của địa chỉ IP
        buffer.rewind();
        return buffer.getLong();
    }
    
    /**
     * Chuyển đổi số long thành chuỗi địa chỉ IP
     */
    private String longToIp(long ip) {
        return ((ip >> 24) & 0xFF) + "." +
               ((ip >> 16) & 0xFF) + "." +
               ((ip >> 8) & 0xFF) + "." +
               (ip & 0xFF);
    }
    
    /**
     * Chuyển đổi số long thành chuỗi subnet mask
     */
    private String longToIpMask(long mask) {
        return ((mask >> 24) & 0xFF) + "." +
               ((mask >> 16) & 0xFF) + "." +
               ((mask >> 8) & 0xFF) + "." +
               (mask & 0xFF);
    }
    
    /**
     * Tính toán độ dài tiền tố CIDR tối ưu cho dải địa chỉ IP
     */
    private int calculateOptimalCIDR(long startIp, long endIp) {
        // Kiểm tra xem có phải là một địa chỉ IP duy nhất không
        if (startIp == endIp) {
            return 32;
        }
        
        // Tính toán số bit cần để biểu diễn khoảng cách giữa start và end
        long range = endIp - startIp + 1;
        int bitsNeeded = 32 - Integer.numberOfLeadingZeros((int)(range - 1));
        
        // CIDR prefix length
        int cidr = 32 - bitsNeeded;
        
        // Kiểm tra xem địa chỉ bắt đầu có phải là địa chỉ mạng của CIDR này không
        long mask = 0xFFFFFFFFl & (0xFFFFFFFFl << bitsNeeded);
        long networkAddress = startIp & mask;
        
        // Nếu địa chỉ mạng tính toán không khớp với địa chỉ bắt đầu
        // hoặc địa chỉ broadcast không khớp với địa chỉ kết thúc,
        // thì cần giảm CIDR để có mạng con phù hợp hơn
        if (networkAddress != startIp) {
            cidr--;
        } else {
            // Tính broadcast address cho CIDR hiện tại
            long invertedMask = 0xFFFFFFFFl & (~mask);
            long broadcastAddress = networkAddress | invertedMask;
            
            // Nếu broadcast address vượt quá endIp, giảm CIDR
            if (broadcastAddress > endIp) {
                cidr++;
            }
        }
        
        // Debug output
        System.out.println("CIDR calculation:");
        System.out.println("Start IP: " + longToIp(startIp));
        System.out.println("End IP: " + longToIp(endIp));
        System.out.println("Range: " + range);
        System.out.println("Bits needed: " + bitsNeeded);
        System.out.println("CIDR: " + cidr);
        
        return cidr;
    }
}   