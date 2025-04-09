package com.devtoolbox.backend.application.services.ServiceImpl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.devtoolbox.backend.application.dto.LoginRequest;
import com.devtoolbox.backend.application.dto.SignUpRequest;
import com.devtoolbox.backend.application.services.AuthenticationService;
import com.devtoolbox.backend.application.services.JWTService;
import com.devtoolbox.backend.data.entities.Role;
import com.devtoolbox.backend.data.entities.User;
import com.devtoolbox.backend.data.entities.VerificationToken;
import com.devtoolbox.backend.data.repositories.UserRepository;
import com.devtoolbox.backend.data.repositories.VerificationTokenRepository;

import jakarta.mail.MessagingException;


@Service
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    private final VerificationTokenRepository tokenRepository;
    private final EmailServiceImpl emailService;

    public AuthenticationServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
                                      JWTService jwtService, VerificationTokenRepository tokenRepository,
                                      EmailServiceImpl emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
    }

    @Override
    public User signup(SignUpRequest signUpRequest) {
        // Kiểm tra email đã tồn tại
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already in use!");
        }

        // Kiểm tra mật khẩu không được null, rỗng hoặc ngắn hơn 8 ký tự
        if (signUpRequest.getPassword() == null || signUpRequest.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty!");
        }

        if (signUpRequest.getPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long!");
        }

        // Tạo người dùng mới
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword())); // Mã hóa mật khẩu
        user.setRole(Role.USER); // Gán vai trò mặc định là USER
        user.setPremium(false); // Mặc định không phải tài khoản premium
        user.setVerified(false); // Đặt trạng thái chưa xác minh
        userRepository.save(user);

        // Tạo mã xác minh
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiryDate(LocalDateTime.now().plusHours(24)); // Token hết hạn sau 24 giờ
        tokenRepository.save(verificationToken);

        // Gửi email xác minh
        String verificationLink = "http://localhost:3000/verify?token=" + token;
        String emailContent = "<p>Click vào liên kết sau để xác minh tài khoản của bạn:</p>"
                + "<a href=\"" + verificationLink + "\">Xác minh tài khoản</a>";
        try {
            emailService.sendEmail(user.getEmail(), "Xác minh tài khoản", emailContent);
        } catch (MessagingException e) {
            // Nếu gửi email thất bại, xóa người dùng và token đã tạo
            tokenRepository.delete(verificationToken);
            userRepository.delete(user);
            throw new IllegalStateException("Failed to send verification email", e);
        }

        return user;
    }

    @Override
    public Map<String, Object> login(LoginRequest loginRequest) {
        // Tìm người dùng theo email
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Email not found!"));

        // Kiểm tra xem tài khoản đã được xác minh chưa
        if (!user.isVerified()) {
            throw new IllegalArgumentException("Please verify your email before logging in!");
        }

        // Kiểm tra mật khẩu
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Password is incorrect!");
        }

        // Tạo JWT token
        String token = jwtService.generateToken(
                user, // UserDetails (username)
                user.getRole().toString(), // Vai trò (role)
                user.getId() // ID của người dùng (userId)
        );

        // Trả về thông tin người dùng và token
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("token", token);
        response.put("email", user.getEmail());
        response.put("role", user.getRole().toString());
        response.put("premium", user.isPremium());

        return response;
    }

    public void verifyEmail(String token) {
        VerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid token!"));
    
        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token has expired!");
        }
    
        User user = verificationToken.getUser();
        user.setVerified(true); // Đặt trạng thái đã xác minh
        userRepository.save(user);
    
        // Xóa token sau khi xác minh
        // tokenRepository.delete(verificationToken);
    }

    public void resendVerificationEmail(String email) {
        // Tìm người dùng theo email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Email not found!"));
    
        // Kiểm tra xem tài khoản đã được xác minh chưa
        if (user.isVerified()) {
            throw new IllegalArgumentException("Account is already verified!");
        }
    
        // Tìm token hiện có
        VerificationToken verificationToken = tokenRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("No verification token found for this user!"));
    
        // Gửi lại email xác minh
        String verificationLink = "http://localhost:3000/verify?token=" + verificationToken.getToken();
        String emailContent = "<p>Click vào liên kết sau để xác minh tài khoản của bạn:</p>"
                + "<a href=\"" + verificationLink + "\">Xác minh tài khoản</a>";
        try {
            emailService.sendEmail(user.getEmail(), "Xác minh tài khoản", emailContent);
        } catch (MessagingException e) {
            throw new IllegalStateException("Failed to send verification email", e);
        }
    }
}