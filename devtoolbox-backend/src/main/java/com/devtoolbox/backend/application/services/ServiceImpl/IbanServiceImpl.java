package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.IbanService;
import org.iban4j.CountryCode;
import org.iban4j.Iban;
import org.iban4j.IbanFormatException;
import org.iban4j.IbanUtil;
import org.iban4j.InvalidCheckDigitException;
import org.iban4j.UnsupportedCountryException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class IbanServiceImpl implements IbanService {

    @Override
    public Map<String, Object> validateAndParseIban(String iban) {
        Map<String, Object> result = new HashMap<>();
        
        // Xóa khoảng trắng từ IBAN
        String cleanedIban = iban.replaceAll("\\s+", "");
        result.put("plainIban", cleanedIban);
        
        try {
            // Kiểm tra tính hợp lệ của IBAN
            IbanUtil.validate(cleanedIban);
            result.put("isValid", true);
            
            // Phân tích chi tiết IBAN
            String countryCode = cleanedIban.substring(0, 2);
            result.put("countryCode", countryCode);
            
            // Lấy tên quốc gia từ mã
            try {
                CountryCode code = CountryCode.getByCode(countryCode);
                result.put("countryName", code.getName());
            } catch (Exception e) {
                result.put("countryName", "Unknown");
            }
            
            // Kiểm tra xem có phải QR-IBAN không (Dựa vào tiêu chuẩn Thụy Sĩ - CH)
            boolean isQrIban = false;
            if ("CH".equals(countryCode) || "LI".equals(countryCode)) {
                // QR-IBAN có mã ngân hàng (vị trí 5-8) từ 30000 đến 31999
                if (cleanedIban.length() >= 8) {
                    String bankCode = cleanedIban.substring(4, 8);
                    int bankCodeNum = Integer.parseInt(bankCode);
                    isQrIban = bankCodeNum >= 3000 && bankCodeNum <= 3199;
                }
            }
            result.put("isQrIban", isQrIban);
            
            // Lấy BBAN (Basic Bank Account Number) - phần IBAN sau mã quốc gia và số kiểm tra
            String bban = cleanedIban.substring(4);
            result.put("bban", bban);
            
            // Định dạng IBAN theo chuẩn hiển thị thân thiện (nhóm 4 ký tự)
            String friendlyIban = Iban.valueOf(cleanedIban).toFormattedString();
            result.put("friendlyFormat", friendlyIban);
            
            // Lấy số kiểm tra (check digits)
            String checkDigits = cleanedIban.substring(2, 4);
            result.put("checkDigits", checkDigits);
            
            // Thêm thông tin chi tiết về ngân hàng nếu có thể
            try {
                Iban ibanObj = Iban.valueOf(cleanedIban);
                result.put("bankCode", ibanObj.getBankCode());
                result.put("branchCode", ibanObj.getBranchCode());
                result.put("accountNumber", ibanObj.getAccountNumber());
                result.put("nationalCheckDigit", ibanObj.getNationalCheckDigit());
            } catch (Exception e) {
                // Trong một số trường hợp, không thể trích xuất chi tiết
                // vì cấu trúc BBAN khác nhau giữa các quốc gia
            }
            
        } catch (IbanFormatException e) {
            result.put("isValid", false);
            result.put("error", "Định dạng IBAN không hợp lệ: " + e.getMessage());
        } catch (InvalidCheckDigitException e) {
            result.put("isValid", false);
            result.put("error", "Số kiểm tra IBAN không hợp lệ");
        } catch (UnsupportedCountryException e) {
            result.put("isValid", false);
            result.put("error", "Mã quốc gia không được hỗ trợ");
        } catch (Exception e) {
            result.put("isValid", false);
            result.put("error", "Lỗi không xác định: " + e.getMessage());
        }
        
        return result;
    }
    
    @Override
    public Map<String, Object> getIbanExamples() {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, String>> examples = new ArrayList<>();
        
        // Danh sách các ví dụ IBAN hợp lệ
        Map<String, String> example1 = new HashMap<>();
        example1.put("country", "France");
        example1.put("iban", "FR76 3000 6000 0112 3456 7890 189");
        examples.add(example1);
        
        Map<String, String> example2 = new HashMap<>();
        example2.put("country", "Germany");
        example2.put("iban", "DE89 3704 0044 0532 0130 00");
        examples.add(example2);
        
        Map<String, String> example3 = new HashMap<>();
        example3.put("country", "UK");
        example3.put("iban", "GB29 NWBK 6016 1331 9268 19");
        examples.add(example3);
        
        Map<String, String> example4 = new HashMap<>();
        example4.put("country", "Switzerland");
        example4.put("iban", "CH93 0076 2011 6238 5295 7");
        examples.add(example4);
        
        Map<String, String> example5 = new HashMap<>();
        example5.put("country", "Italy");
        example5.put("iban", "IT60 X054 2811 1010 0000 0123 456");
        examples.add(example5);
        
        result.put("examples", examples);
        return result;
    }
}