package com.devtoolbox.backend.application.services.ServiceImpl;

import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.devtoolbox.backend.application.services.JWTService;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class JWTServiceImpl implements JWTService {

    private static final Dotenv dotenv = Dotenv.load(); // Load file .env
    private static final String SECRET_KEY = dotenv.get("JWT_SECRET_KEY");
    private static final long EXPIRATION_TIME = Long.parseLong(dotenv.get("JWT_EXPIRATION_TIME", "86400000"));

    private Key getSigninKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(UserDetails userDetails, String role, Long userId) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername()) // Lưu username vào token
                .claim("role", role) // Thêm vai trò vào payload
                .claim("userId", userId) // Thêm userId vào payload
                .setIssuedAt(new Date()) // Thời gian phát hành token
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // Hết hạn sau 24h
                .signWith(getSigninKey(), SignatureAlgorithm.HS256) // Ký token bằng SHA-256
                .compact();
    }

    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigninKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            // Log lỗi chi tiết
            System.err.println("Token không hợp lệ hoặc đã hết hạn: " + e.getMessage());
            throw new IllegalArgumentException("Invalid or expired token");
        }
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUserName(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }
}
