package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.NumeronymService;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.stream.Collectors;

@Service
public class NumeronymServiceImpl implements NumeronymService {

    @Override
    public String generateNumeronym(String input) {
        // Xử lý input null hoặc rỗng
        if (input == null || input.isEmpty()) {
            return "";
        }
        
        // Nếu từ quá ngắn (ít hơn 3 ký tự), không tạo numeronym
        if (input.length() < 3) {
            return input;
        }
        
        // Tạo numeronym: ký tự đầu + số lượng ký tự giữa + ký tự cuối
        char firstChar = input.charAt(0);
        char lastChar = input.charAt(input.length() - 1);
        int middleCharsCount = input.length() - 2;
        
        return String.valueOf(firstChar) + middleCharsCount + String.valueOf(lastChar);
    }
    
    @Override
    public String generateSentenceNumeronyms(String sentence) {
        if (sentence == null || sentence.isEmpty()) {
            return "";
        }
        
        // Tách câu thành các từ và chuyển từng từ thành numeronym
        String[] words = sentence.split("\\s+");
        
        return Arrays.stream(words)
                .map(this::processWord)
                .collect(Collectors.joining(" "));
    }
    
    /**
     * Xử lý một từ để tạo numeronym, giữ lại các dấu câu
     */
    private String processWord(String word) {
        if (word.length() < 3) {
            return word;
        }
        
        // Tách các dấu câu ở cuối từ
        String punctuation = "";
        int endIndex = word.length();
        
        while (endIndex > 0 && !Character.isLetterOrDigit(word.charAt(endIndex - 1))) {
            punctuation = word.charAt(endIndex - 1) + punctuation;
            endIndex--;
        }
        
        if (endIndex < word.length()) {
            String wordWithoutPunctuation = word.substring(0, endIndex);
            if (wordWithoutPunctuation.length() < 3) {
                return word; // Nếu từ quá ngắn sau khi bỏ dấu câu, giữ nguyên
            }
            
            return generateNumeronym(wordWithoutPunctuation) + punctuation;
        }
        
        return generateNumeronym(word);
    }
}