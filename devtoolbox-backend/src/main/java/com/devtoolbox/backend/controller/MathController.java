package com.devtoolbox.backend.controller;

import org.springframework.web.bind.annotation.*;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.util.Map;

@RestController
@RequestMapping("/api/math")
@CrossOrigin(origins = "*")
public class MathController {

    @PostMapping("/evaluate")
    public Map<String, Object> evaluateExpression(@RequestBody Map<String, String> request) {
        String expression = request.get("expression");
        ScriptEngine engine = new ScriptEngineManager().getEngineByName("JavaScript");

        try {
            Object result = engine.eval(expression);
            return Map.of("result", result);
        } catch (ScriptException e) {
            return Map.of("message", "Invalid expression: " + e.getMessage());
        }
    }
}