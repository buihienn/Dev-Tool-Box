package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.JSONFormatterService;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import java.io.IOException;

@Service
public class JSONFormatterServiceImpl implements JSONFormatterService {

    private final ObjectMapper objectMapper;

    public JSONFormatterServiceImpl() {
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public String formatJSON(String rawJson, int indentSize) throws Exception {
        Object jsonObject = objectMapper.readValue(rawJson, Object.class);

        // Nếu indentSize <= 0, trả về JSON không thụt lề
        if (indentSize <= 0) {
            return objectMapper.writeValueAsString(jsonObject);
        }

        // Tạo DefaultPrettyPrinter với kích thước thụt lề tùy chỉnh
        DefaultPrettyPrinter prettyPrinter = new DefaultPrettyPrinter();
        prettyPrinter.indentArraysWith(new DefaultPrettyPrinter.FixedSpaceIndenter());
        prettyPrinter.indentObjectsWith(new DefaultPrettyPrinter.Indenter() {
            private final String indent = " ".repeat(indentSize);

            @Override
            public void writeIndentation(JsonGenerator jg, int level) throws IOException {
                jg.writeRaw("\n");
                for (int i = 0; i < level; i++) {
                    jg.writeRaw(indent);
                }
            }

            @Override
            public boolean isInline() {
                return false;
            }
        });

        // Trả về JSON đã định dạng
        return objectMapper.writer(prettyPrinter).writeValueAsString(jsonObject);
    }
}