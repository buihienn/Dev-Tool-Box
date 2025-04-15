package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.PhoneParserService;
import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberToCarrierMapper;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.PhoneNumberUtil.PhoneNumberFormat;
import com.google.i18n.phonenumbers.PhoneNumberUtil.PhoneNumberType;
import com.google.i18n.phonenumbers.Phonenumber.PhoneNumber;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PhoneParserServiceImpl implements PhoneParserService {

    private final PhoneNumberUtil phoneNumberUtil;
    private final PhoneNumberToCarrierMapper carrierMapper;
    
    public PhoneParserServiceImpl() {
        this.phoneNumberUtil = PhoneNumberUtil.getInstance();
        this.carrierMapper = PhoneNumberToCarrierMapper.getInstance();
    }
    
    @Override
    public Map<String, Object> parsePhoneNumber(String phoneNumber, String countryCode) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Parse số điện thoại
            PhoneNumber number = phoneNumberUtil.parse(phoneNumber, countryCode);
            
            // Thông tin cơ bản
            result.put("countryCode", phoneNumberUtil.getRegionCodeForNumber(number));
            result.put("countryName", getCountryName(phoneNumberUtil.getRegionCodeForNumber(number)));
            result.put("callingCode", number.getCountryCode());
            result.put("isValid", phoneNumberUtil.isValidNumber(number));
            result.put("isPossible", phoneNumberUtil.isPossibleNumber(number));
            
            // Loại số điện thoại
            PhoneNumberType numberType = phoneNumberUtil.getNumberType(number);
            result.put("type", getPhoneNumberTypeName(numberType));
            
            // Các định dạng
            result.put("internationalFormat", phoneNumberUtil.format(number, PhoneNumberFormat.INTERNATIONAL));
            result.put("nationalFormat", phoneNumberUtil.format(number, PhoneNumberFormat.NATIONAL));
            result.put("e164Format", phoneNumberUtil.format(number, PhoneNumberFormat.E164));
            result.put("rfc3966Format", phoneNumberUtil.format(number, PhoneNumberFormat.RFC3966));
            
            // Thông tin bổ sung
            result.put("carrier", carrierMapper.getNameForNumber(number, Locale.ENGLISH));
            
        } catch (NumberParseException e) {
            result.put("error", "Không thể phân tích số điện thoại: " + e.getMessage());
            result.put("isValid", false);
        }
        
        return result;
    }
    
    @Override
    public Map<String, Object> getSupportedCountries() {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, String>> countries = new ArrayList<>();
        
        Set<String> regions = phoneNumberUtil.getSupportedRegions();
        for (String region : regions) {
            Map<String, String> countryInfo = new HashMap<>();
            countryInfo.put("code", region);
            countryInfo.put("name", getCountryName(region));
            countryInfo.put("callingCode", "+" + phoneNumberUtil.getCountryCodeForRegion(region));
            countries.add(countryInfo);
        }
        
        // Sắp xếp theo tên quốc gia
        countries.sort(Comparator.comparing(c -> c.get("name")));
        
        result.put("countries", countries);
        return result;
    }
    
    /**
     * Lấy tên quốc gia từ mã quốc gia
     */
    private String getCountryName(String countryCode) {
        Locale locale = new Locale.Builder().setRegion(countryCode).build();
        return locale.getDisplayCountry(Locale.ENGLISH);
    }
    
    /**
     * Chuyển đổi loại số điện thoại từ enum sang chuỗi mô tả
     */
    private String getPhoneNumberTypeName(PhoneNumberType type) {
        switch (type) {
            case MOBILE:
                return "Mobile";
            case FIXED_LINE:
                return "Fixed Line";
            case FIXED_LINE_OR_MOBILE:
                return "Fixed Line or Mobile";
            case TOLL_FREE:
                return "Toll Free";
            case PREMIUM_RATE:
                return "Premium Rate";
            case SHARED_COST:
                return "Shared Cost";
            case VOIP:
                return "VoIP";
            case PERSONAL_NUMBER:
                return "Personal Number";
            case PAGER:
                return "Pager";
            case UAN:
                return "UAN";
            case VOICEMAIL:
                return "Voicemail";
            default:
                return "Unknown";
        }
    }
}