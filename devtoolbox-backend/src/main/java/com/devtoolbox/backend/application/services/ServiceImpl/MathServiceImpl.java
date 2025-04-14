package com.devtoolbox.backend.application.services.ServiceImpl;

import org.springframework.stereotype.Service;
import com.devtoolbox.backend.application.services.MathService;
import com.udojava.evalex.Expression;

import java.math.BigDecimal;

@Service
public class MathServiceImpl implements MathService {

    @Override
    public double evaluateExpression(String expression) throws Exception {
        if (expression == null || expression.trim().isEmpty()) {
            throw new IllegalArgumentException("Biểu thức không được để trống");
        }
        
        try {
            // Tiền xử lý biểu thức để chuyển đổi các hàm toán học phổ biến
            expression = preprocessExpression(expression);
            
            // Sử dụng EvalEx để tính toán biểu thức
            Expression exp = new Expression(expression);
            BigDecimal result = exp.eval();
            
            return result.doubleValue();
        } catch (Exception e) {
            throw new Exception("Biểu thức không hợp lệ: " + e.getMessage());
        }
    }
    
    /**
     * Tiền xử lý biểu thức toán học để chuyển đổi các hàm toán học phổ biến
     * sang định dạng EvalEx.
     */
    private String preprocessExpression(String expression) {
        // Không cần nhiều xử lý vì EvalEx hỗ trợ sẵn các hàm này
        expression = expression.replaceAll("(?i)\\bPI\\b", "PI");
        expression = expression.replaceAll("(?i)\\bE\\b", "e");
        
        return expression;
    }
}