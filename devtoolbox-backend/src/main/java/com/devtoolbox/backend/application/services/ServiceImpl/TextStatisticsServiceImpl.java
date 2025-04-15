package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.TextStatisticsService;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class TextStatisticsServiceImpl implements TextStatisticsService {

    private static final Pattern WORD_PATTERN = Pattern.compile("\\s+");

    @Override
    public Map<String, Object> analyzeText(String text) {
        Map<String, Object> statistics = new HashMap<>();
        
        // Xử lý text null hoặc rỗng
        if (text == null || text.isEmpty()) {
            text = "";
        }
        
        // 1. Số ký tự (tổng số)
        int charCount = text.length();
        statistics.put("charCount", charCount);
        
        // 2. Số ký tự (không tính khoảng trắng)
        int charCountNoSpaces = text.replaceAll("\\s", "").length();
        statistics.put("charCountNoSpaces", charCountNoSpaces);
        
        // 3. Số từ
        int wordCount = text.trim().isEmpty() ? 0 : WORD_PATTERN.split(text.trim()).length;
        statistics.put("wordCount", wordCount);
        
        // 4. Số dòng
        int lineCount = text.isEmpty() ? 0 : text.split("\r\n|\r|\n").length;
        statistics.put("lineCount", lineCount);
        
        // 5. Kích thước byte
        byte[] bytes = text.getBytes(StandardCharsets.UTF_8);
        int byteSize = bytes.length;
        statistics.put("byteSize", byteSize);
        
        // 6. Định dạng kích thước byte với đơn vị thích hợp
        statistics.put("formattedByteSize", formatByteSize(byteSize));
        
        // 7. Số câu (kết thúc bằng dấu chấm, chấm hỏi, hoặc chấm than)
        int sentenceCount = text.isEmpty() ? 0 : text.split("[.!?]+").length;
        statistics.put("sentenceCount", sentenceCount);
        
        // 8. Thời gian đọc (giả sử tốc độ đọc trung bình là 200 từ/phút)
        double readingTimeMinutes = wordCount / 200.0;
        statistics.put("readingTimeMinutes", readingTimeMinutes);
        
        // 9. Thời gian đọc được định dạng
        statistics.put("formattedReadingTime", formatReadingTime(readingTimeMinutes));
        
        return statistics;
    }
    
    /**
     * Định dạng kích thước byte thành chuỗi có đơn vị
     */
    private String formatByteSize(int bytes) {
        if (bytes < 1024) {
            return bytes + " Bytes";
        } else if (bytes < 1024 * 1024) {
            return String.format("%.2f KB", bytes / 1024.0);
        } else {
            return String.format("%.2f MB", bytes / (1024.0 * 1024.0));
        }
    }
    
    /**
     * Định dạng thời gian đọc thành chuỗi
     */
    private String formatReadingTime(double minutes) {
        if (minutes < 1.0) {
            return "dưới 1 phút";
        } else if (minutes < 60.0) {
            int mins = (int) Math.ceil(minutes);
            return mins + " phút";
        } else {
            int hours = (int) (minutes / 60);
            int mins = (int) Math.ceil(minutes % 60);
            return hours + " giờ " + (mins > 0 ? mins + " phút" : "");
        }
    }
}