package com.devtoolbox.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.devtoolbox.backend.application.services.JWTService;
import com.devtoolbox.backend.application.services.UserService;

import org.springframework.lang.NonNull;



@Component

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JWTService jwtService;
    private final UserService userService;

    public JwtAuthenticationFilter(JWTService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal (@NonNull HttpServletRequest req, @NonNull HttpServletResponse res, @NonNull FilterChain filterChain)  throws ServletException, IOException{
        final String authHeader = req.getHeader("Authorization");
        final String username;
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(req, res);
            return;
        }

        final String jwt = authHeader.substring(7);
        username = jwtService.extractUserName(jwt);

        if (StringUtils.hasText(username) && SecurityContextHolder.getContext().getAuthentication() == null){
            UserDetails userDetails = userService.userDetailsService().loadUserByUsername(username);

            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));

                SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
                securityContext.setAuthentication(authToken);
                SecurityContextHolder.setContext(securityContext);

            }
        }
        filterChain.doFilter(req, res);

    }
    
}
