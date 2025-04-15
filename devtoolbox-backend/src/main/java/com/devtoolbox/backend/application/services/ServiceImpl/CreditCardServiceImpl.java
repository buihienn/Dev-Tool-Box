package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.CreditCardService;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class CreditCardServiceImpl implements CreditCardService {

    // Regex patterns để xác định loại thẻ
    private static final Pattern VISA_PATTERN = Pattern.compile("^4[0-9]{12}(?:[0-9]{3})?$");
    private static final Pattern MASTERCARD_PATTERN = Pattern.compile("^5[1-5][0-9]{14}$");
    private static final Pattern AMEX_PATTERN = Pattern.compile("^3[47][0-9]{13}$");
    private static final Pattern DISCOVER_PATTERN = Pattern.compile("^6(?:011|5[0-9]{2})[0-9]{12}$");
    private static final Pattern DINERS_CLUB_PATTERN = Pattern.compile("^3(?:0[0-5]|[68][0-9])[0-9]{11}$");
    private static final Pattern JCB_PATTERN = Pattern.compile("^(?:2131|1800|35\\d{3})\\d{11}$");
    private static final Pattern UNIONPAY_PATTERN = Pattern.compile("^(62|88)[0-9]{14,17}$");

    @Override
    public Map<String, Object> validateAndParseCardNumber(String cardNumber, String expiryDate, String cvv) {
        Map<String, Object> result = new HashMap<>();
        
        // Xóa khoảng trắng và dấu gạch ngang từ số thẻ
        String cleanedCardNumber = cardNumber.replaceAll("[\\s-]", "");
        result.put("cardNumber", cleanedCardNumber);
        
        // Định dạng số thẻ để hiển thị dễ đọc
        result.put("formattedCardNumber", formatCardNumber(cleanedCardNumber));
        
        // Xác thực độ dài cơ bản
        if (cleanedCardNumber.length() < 13 || cleanedCardNumber.length() > 19) {
            result.put("isValid", false);
            result.put("error", "Số thẻ phải có từ 13-19 chữ số");
            return result;
        }
        
        // Kiểm tra xem có chứa ký tự không phải số không
        if (!cleanedCardNumber.matches("\\d+")) {
            result.put("isValid", false);
            result.put("error", "Số thẻ chỉ được chứa chữ số");
            return result;
        }
        
        // Kiểm tra tính hợp lệ theo thuật toán Luhn
        boolean passesLuhnCheck = validateLuhn(cleanedCardNumber);
        result.put("isValid", passesLuhnCheck);
        
        if (!passesLuhnCheck) {
            result.put("error", "Số thẻ không hợp lệ (không đạt kiểm tra Luhn)");
            return result;
        }
        
        // Xác định loại thẻ
        String cardType = identifyCardType(cleanedCardNumber);
        result.put("cardType", cardType);
        
        // Thêm các thông tin về IIN/BIN (6 chữ số đầu)
        String bin = cleanedCardNumber.substring(0, Math.min(6, cleanedCardNumber.length()));
        result.put("bin", bin);
        
        // Thông tin về độ dài
        result.put("length", cleanedCardNumber.length());
        
        // Kiểm tra CVV nếu được cung cấp
        if (cvv != null && !cvv.isEmpty()) {
            result.put("cvvProvided", true);
            boolean isCvvValid = validateCvv(cvv, cardType);
            result.put("isCvvValid", isCvvValid);
            
            // Độ dài mong đợi của CVV
            int expectedCvvLength = "American Express".equals(cardType) ? 4 : 3;
            result.put("expectedCvvLength", expectedCvvLength);
        } else {
            result.put("cvvProvided", false);
        }
        
        // Kiểm tra ngày hết hạn nếu được cung cấp
        if (expiryDate != null && !expiryDate.isEmpty()) {
            result.put("expiryDateProvided", true);
            
            try {
                // Format ngày hết hạn: MM/YY hoặc MM/YYYY
                String cleanExpiryDate = expiryDate.trim();
                DateTimeFormatter formatter;
                
                if (cleanExpiryDate.length() <= 5) { // MM/YY
                    formatter = DateTimeFormatter.ofPattern("MM/yy");
                } else { // MM/YYYY
                    formatter = DateTimeFormatter.ofPattern("MM/yyyy");
                }
                
                YearMonth expiry = YearMonth.parse(cleanExpiryDate, formatter);
                YearMonth currentDate = YearMonth.now();
                
                boolean isExpiryValid = !expiry.isBefore(currentDate);
                result.put("isExpiryValid", isExpiryValid);
                
                if (!isExpiryValid) {
                    result.put("expiryError", "Thẻ đã hết hạn");
                }
                
                // Thêm thông tin về ngày hết hạn
                result.put("expiryMonth", expiry.getMonthValue());
                result.put("expiryYear", expiry.getYear());
                result.put("formattedExpiry", expiry.format(DateTimeFormatter.ofPattern("MM/yyyy")));
                
            } catch (DateTimeParseException e) {
                result.put("isExpiryValid", false);
                result.put("expiryError", "Định dạng ngày hết hạn không hợp lệ (sử dụng MM/YY hoặc MM/YYYY)");
            }
        } else {
            result.put("expiryDateProvided", false);
        }
        
        // Thêm thông tin về nhà phát hành thẻ
        result.putAll(getCardIssuerInfo(cleanedCardNumber, cardType));
        
        return result;
    }
    
    @Override
    public Map<String, Object> getCardExamples() {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, String>> examples = new ArrayList<>();
        
        // Visa
        Map<String, String> visa = new HashMap<>();
        visa.put("type", "Visa");
        visa.put("number", "4111 1111 1111 1111");
        visa.put("cvv", "123");
        visa.put("expiry", "12/2025");
        examples.add(visa);
        
        // MasterCard
        Map<String, String> mastercard = new HashMap<>();
        mastercard.put("type", "MasterCard");
        mastercard.put("number", "5555 5555 5555 4444");
        mastercard.put("cvv", "123");
        mastercard.put("expiry", "12/2025");
        examples.add(mastercard);
        
        // American Express
        Map<String, String> amex = new HashMap<>();
        amex.put("type", "American Express");
        amex.put("number", "3782 822463 10005");
        amex.put("cvv", "1234");
        amex.put("expiry", "12/2025");
        examples.add(amex);
        
        // Discover
        Map<String, String> discover = new HashMap<>();
        discover.put("type", "Discover");
        discover.put("number", "6011 1111 1111 1117");
        discover.put("cvv", "123");
        discover.put("expiry", "12/2025");
        examples.add(discover);
        
        // JCB
        Map<String, String> jcb = new HashMap<>();
        jcb.put("type", "JCB");
        jcb.put("number", "3530 1113 3330 0000");
        jcb.put("cvv", "123");
        jcb.put("expiry", "12/2025");
        examples.add(jcb);
        
        result.put("examples", examples);
        return result;
    }
    
    /**
     * Xác thực số thẻ sử dụng thuật toán Luhn
     */
    private boolean validateLuhn(String cardNumber) {
        int sum = 0;
        boolean alternate = false;
        
        for (int i = cardNumber.length() - 1; i >= 0; i--) {
            int n = Integer.parseInt(cardNumber.substring(i, i + 1));
            if (alternate) {
                n *= 2;
                if (n > 9) {
                    n = (n % 10) + 1;
                }
            }
            sum += n;
            alternate = !alternate;
        }
        
        return (sum % 10 == 0);
    }
    
    /**
     * Xác định loại thẻ dựa trên mẫu số
     */
    private String identifyCardType(String cardNumber) {
        if (VISA_PATTERN.matcher(cardNumber).matches()) {
            return "Visa";
        } else if (MASTERCARD_PATTERN.matcher(cardNumber).matches()) {
            return "MasterCard";
        } else if (AMEX_PATTERN.matcher(cardNumber).matches()) {
            return "American Express";
        } else if (DISCOVER_PATTERN.matcher(cardNumber).matches()) {
            return "Discover";
        } else if (DINERS_CLUB_PATTERN.matcher(cardNumber).matches()) {
            return "Diners Club";
        } else if (JCB_PATTERN.matcher(cardNumber).matches()) {
            return "JCB";
        } else if (UNIONPAY_PATTERN.matcher(cardNumber).matches()) {
            return "China UnionPay";
        } else {
            return "Unknown";
        }
    }
    
    /**
     * Định dạng số thẻ để hiển thị (nhóm 4 chữ số)
     */
    private String formatCardNumber(String cardNumber) {
        if ("American Express".equals(identifyCardType(cardNumber))) {
            // American Express: xxxx xxxxxx xxxxx
            return cardNumber.replaceAll("(\\d{4})(\\d{6})(\\d{5})", "$1 $2 $3");
        } else {
            // Others: xxxx xxxx xxxx xxxx [xxx[x]]
            return cardNumber.replaceAll("(\\d{4})(?=\\d)", "$1 ");
        }
    }
    
    /**
     * Xác thực mã CVV dựa trên loại thẻ
     */
    private boolean validateCvv(String cvv, String cardType) {
        if (cvv == null || !cvv.matches("\\d+")) {
            return false;
        }
        
        if ("American Express".equals(cardType)) {
            return cvv.length() == 4;
        } else {
            return cvv.length() == 3;
        }
    }
    
    /**
     * Lấy thông tin về nhà phát hành thẻ dựa trên BIN
     */
    private Map<String, Object> getCardIssuerInfo(String cardNumber, String cardType) {
        Map<String, Object> issuerInfo = new HashMap<>();
        
        // Thông tin cơ bản từ loại thẻ
        switch (cardType) {
            case "Visa":
                issuerInfo.put("issuerNetwork", "Visa");
                issuerInfo.put("cardCategory", determineCardCategory(cardNumber, "Visa"));
                break;
            case "MasterCard":
                issuerInfo.put("issuerNetwork", "MasterCard");
                issuerInfo.put("cardCategory", determineCardCategory(cardNumber, "MasterCard"));
                break;
            case "American Express":
                issuerInfo.put("issuerNetwork", "American Express");
                issuerInfo.put("cardCategory", "Credit Card");
                break;
            case "Discover":
                issuerInfo.put("issuerNetwork", "Discover");
                issuerInfo.put("cardCategory", "Credit Card");
                break;
            case "Diners Club":
                issuerInfo.put("issuerNetwork", "Diners Club International");
                issuerInfo.put("cardCategory", "Credit Card");
                break;
            case "JCB":
                issuerInfo.put("issuerNetwork", "JCB (Japan Credit Bureau)");
                issuerInfo.put("cardCategory", "Credit Card");
                break;
            case "China UnionPay":
                issuerInfo.put("issuerNetwork", "China UnionPay");
                issuerInfo.put("cardCategory", determineCardCategory(cardNumber, "China UnionPay"));
                break;
            default:
                issuerInfo.put("issuerNetwork", "Unknown");
                issuerInfo.put("cardCategory", "Unknown");
        }
        
        // Thông tin về vùng phát hành
        issuerInfo.put("region", determineRegion(cardNumber, cardType));
        
        return issuerInfo;
    }
    
    /**
     * Xác định loại thẻ (Credit, Debit, v.v.)
     */
    private String determineCardCategory(String cardNumber, String cardType) {
        // Một số heuristic đơn giản để xác định loại thẻ
        // Trong thực tế, điều này cần database đầy đủ về BIN
        
        if ("Visa".equals(cardType)) {
            if (cardNumber.startsWith("4026") || cardNumber.startsWith("4508") || cardNumber.startsWith("4844") || cardNumber.startsWith("4913") || cardNumber.startsWith("4917")) {
                return "Visa Electron";
            } else if (cardNumber.startsWith("4") && cardNumber.length() == 16) {
                return "Visa Credit Card";
            } else {
                return "Visa Card";
            }
        } else if ("MasterCard".equals(cardType)) {
            if (cardNumber.startsWith("51") || cardNumber.startsWith("52") || cardNumber.startsWith("53") || cardNumber.startsWith("54") || cardNumber.startsWith("55")) {
                return "MasterCard Credit Card";
            } else {
                return "MasterCard";
            }
        } else if ("China UnionPay".equals(cardType)) {
            if (cardNumber.startsWith("62")) {
                return "UnionPay Credit/Debit Card";
            } else {
                return "UnionPay Card";
            }
        }
        
        return "Credit/Debit Card";
    }
    
    /**
     * Xác định vùng phát hành thẻ
     */
    private String determineRegion(String cardNumber, String cardType) {
        // Xác định vùng dựa trên loại thẻ và BIN
        // Đây chỉ là ví dụ đơn giản, trong thực tế cần database BIN
        
        switch (cardType) {
            case "Visa":
                return "Global (US-based)";
            case "MasterCard":
                return "Global (US-based)";
            case "American Express":
                return "USA & Global";
            case "Discover":
                return "USA & Selected Countries";
            case "Diners Club":
                return "Global";
            case "JCB":
                return "Japan & Asia Pacific";
            case "China UnionPay":
                return "China & Selected Countries";
            default:
                return "Unknown";
        }
    }
}