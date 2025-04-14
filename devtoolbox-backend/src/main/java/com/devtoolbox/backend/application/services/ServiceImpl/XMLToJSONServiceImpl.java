package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.XMLToJSONService;
import org.json.JSONObject;
import org.json.XML;
import org.springframework.stereotype.Service;

@Service
public class XMLToJSONServiceImpl implements XMLToJSONService {

    @Override
    public String convertXMLToJSON(String xmlContent) throws Exception {
        try {
            JSONObject jsonObject = XML.toJSONObject(xmlContent);
            return jsonObject.toString(2); // Định dạng JSON đẹp
        } catch (Exception e) {
            throw new Exception("Invalid XML input.");
        }
    }
}