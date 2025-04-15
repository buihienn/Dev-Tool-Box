package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.LoremIpsumService;
import org.springframework.stereotype.Service;

import java.util.concurrent.ThreadLocalRandom;

@Service
public class LoremIpsumServiceImpl implements LoremIpsumService {
    
    // Danh sách từ Latin để tạo văn bản Lorem Ipsum
    private static final String[] LOREM_WORDS = {
        "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "a", "ac", 
        "accumsan", "ad", "aenean", "aliquam", "aliquet", "ante", "aptent", "arcu", "at", "auctor", 
        "augue", "bibendum", "blandit", "class", "commodo", "condimentum", "congue", "consequat", 
        "conubia", "convallis", "cras", "cubilia", "curabitur", "curae", "dapibus", "diam", "dictum", 
        "dictumst", "dignissim", "dis", "donec", "dui", "duis", "efficitur", "eget", "eleifend", 
        "elementum", "enim", "erat", "eros", "est", "et", "etiam", "eu", "euismod", "ex", 
        "facilisi", "facilisis", "fames", "faucibus", "felis", "fermentum", "feugiat", "finibus", 
        "fringilla", "fusce", "gravida", "habitant", "habitasse", "hac", "hendrerit", "himenaeos", 
        "iaculis", "id", "imperdiet", "in", "inceptos", "integer", "interdum", "justo", "lacinia", 
        "lacus", "laoreet", "lectus", "leo", "libero", "ligula", "litora", "lobortis", "luctus", 
        "maecenas", "magna", "magnis", "malesuada", "massa", "mattis", "mauris", "maximus", "metus", 
        "mi", "molestie", "mollis", "montes", "morbi", "mus", "nam", "nascetur", "natoque", "nec", 
        "neque", "netus", "nibh", "nisi", "nisl", "non", "nostra", "nulla", "nullam", "nunc", "odio", 
        "orci", "ornare", "pellentesque", "penatibus", "per", "pharetra", "phasellus", "placerat", 
        "platea", "porta", "porttitor", "posuere", "potenti", "praesent", "pretium", "primis", 
        "proin", "pulvinar", "purus", "quam", "quis", "quisque", "rhoncus", "ridiculus", "risus", 
        "rutrum", "sagittis", "sapien", "scelerisque", "sed", "sem", "semper", "senectus", 
        "sociosqu", "sodales", "sollicitudin", "suscipit", "suspendisse", "taciti", "tellus", 
        "tempor", "tempus", "tincidunt", "torquent", "tortor", "tristique", "turpis", "ullamcorper", 
        "ultrices", "ultricies", "urna", "ut", "varius", "vehicula", "vel", "velit", "venenatis", 
        "vestibulum", "vitae", "vivamus", "viverra", "volutpat", "vulputate"
    };
    
    private static final String LOREM_START = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    
    @Override
    public String generate(
            int paragraphs,
            int minSentences,
            int maxSentences,
            int minWords,
            int maxWords,
            boolean startWithLorem,
            boolean asHtml
    ) {
        StringBuilder result = new StringBuilder();
        
        for (int i = 0; i < paragraphs; i++) {
            String paragraph = generateParagraph(
                minSentences, maxSentences,
                minWords, maxWords,
                i == 0 && startWithLorem
            );
            
            if (asHtml) {
                result.append("<p>").append(paragraph).append("</p>");
                if (i < paragraphs - 1) {
                    result.append("\n");
                }
            } else {
                result.append(paragraph);
                if (i < paragraphs - 1) {
                    result.append("\n\n");
                }
            }
        }
        
        return result.toString();
    }
    
    private String generateParagraph(int minSentences, int maxSentences, int minWords, int maxWords, boolean startWithLorem) {
        // Xác định số câu ngẫu nhiên trong khoảng cho phép
        int sentenceCount = getRandomNumberInRange(minSentences, maxSentences);
        
        StringBuilder paragraph = new StringBuilder();
        
        for (int i = 0; i < sentenceCount; i++) {
            if (i == 0 && startWithLorem) {
                // Sử dụng câu bắt đầu mặc định "Lorem ipsum dolor sit amet..."
                paragraph.append(LOREM_START);
            } else {
                paragraph.append(generateSentence(minWords, maxWords));
            }
            
            // Thêm khoảng trắng sau mỗi câu ngoại trừ câu cuối cùng
            if (i < sentenceCount - 1) {
                paragraph.append(" ");
            }
        }
        
        return paragraph.toString();
    }
    
    private String generateSentence(int minWords, int maxWords) {
        // Xác định số từ ngẫu nhiên trong khoảng cho phép
        int wordCount = getRandomNumberInRange(minWords, maxWords);
        
        StringBuilder sentence = new StringBuilder();
        
        for (int i = 0; i < wordCount; i++) {
            String word = LOREM_WORDS[ThreadLocalRandom.current().nextInt(LOREM_WORDS.length)];
            
            // Viết hoa chữ cái đầu tiên nếu là từ đầu tiên của câu
            if (i == 0) {
                word = word.substring(0, 1).toUpperCase() + word.substring(1);
            }
            
            sentence.append(word);
            
            // Thêm dấu phẩy sau khoảng 1/4 số từ, không bao gồm từ cuối cùng
            if (i < wordCount - 1) {
                if (i > 0 && i % 4 == 0 && ThreadLocalRandom.current().nextBoolean()) {
                    sentence.append(",");
                }
                sentence.append(" ");
            }
        }
        
        // Thêm dấu chấm ở cuối câu
        sentence.append(".");
        
        return sentence.toString();
    }
    
    private int getRandomNumberInRange(int min, int max) {
        // Nếu min lớn hơn max, đổi chỗ để đảm bảo phạm vi hợp lệ
        if (min > max) {
            int temp = min;
            min = max;
            max = temp;
        }
        
        return ThreadLocalRandom.current().nextInt(min, max + 1);
    }
}