package com.devtoolbox.backend.config;

import com.devtoolbox.backend.application.services.ToolService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class ToolFilter extends OncePerRequestFilter {

    private final ToolService toolService;

    public ToolFilter(ToolService toolService) {
        this.toolService = toolService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String requestURI = request.getRequestURI();

        // Kiểm tra nếu URL bắt đầu bằng "/tool/"
        if (requestURI.startsWith("/tool/")) {

            System.out.println("Request URI: " + requestURI); // In ra URL để kiểm tra
            String[] uriParts = requestURI.split("/");
            if (uriParts.length < 2 || uriParts[2].isEmpty()) {
                throw new IllegalArgumentException("Invalid tool name");
            }

            String toolName = uriParts[2];
            boolean isEnabled = toolService.isToolEnabled(toolName);
            System.out.println("Tool name: " + toolName + ", isEnabled: " + isEnabled); 
            if (!isEnabled) {
                throw new IllegalStateException("Tool is disabled");
            }
        }

        filterChain.doFilter(request, response); // Tiếp tục xử lý request
    }
}