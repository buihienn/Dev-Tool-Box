package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.URLParserService;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.*;

@Service
public class URLParserServiceImpl implements URLParserService {

    @Override
    public Map<String, Object> parseURL(String urlString) {
        Map<String, Object> result = new HashMap<>();

        try {
            URL url = new URL(urlString);

            result.put("protocol", url.getProtocol());
            result.put("username", url.getUserInfo() != null ? url.getUserInfo().split(":")[0] : "");
            result.put("password", url.getUserInfo() != null && url.getUserInfo().contains(":") ? url.getUserInfo().split(":")[1] : "");
            result.put("hostname", url.getHost());
            result.put("port", url.getPort() == -1 ? "" : String.valueOf(url.getPort()));
            result.put("path", url.getPath());
            result.put("paramsString", url.getQuery());

            List<Map<String, String>> params = new ArrayList<>();
            if (url.getQuery() != null) {
                String[] pairs = url.getQuery().split("&");
                for (String pair : pairs) {
                    String[] keyValue = pair.split("=");
                    params.add(Map.of("key", keyValue[0], "value", keyValue.length > 1 ? keyValue[1] : ""));
                }
            }
            result.put("params", params);

        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid URL");
        }

        return result;
    }
}