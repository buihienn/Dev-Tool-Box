package com.devtoolbox.backend.application.services.ServiceImpl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.devtoolbox.backend.application.dto.LoginRequest;
import com.devtoolbox.backend.application.dto.SignUpRequest;
import com.devtoolbox.backend.application.services.AuthenticationService;
import com.devtoolbox.backend.application.services.JWTService;
import com.devtoolbox.backend.data.entities.Role;
import com.devtoolbox.backend.data.entities.User;
import com.devtoolbox.backend.data.repositories.UserRepository;

@Service
public class AuthenticationServiceImpl implements AuthenticationService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;

    public AuthenticationServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JWTService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User signup(SignUpRequest signUpRequest){

        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is used!");
        }
    
        // Kiểm tra mật khẩu không được null hoặc rỗng
        if (signUpRequest.getPassword() == null || signUpRequest.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty!");
        }

        if (signUpRequest.getPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long!");
        }

        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        // user.setFirstName(signUpRequest.getFirstName());
        // user.setLastName(signUpRequest.getLastName());
        user.setRole(Role.USER);
        user.setPremium(false);
        return userRepository.save(user);
    }

    @Override
    public Map<String, Object> login(LoginRequest loginRequest) {
        // Tìm người dùng theo email
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Email not found!"));

        // Kiểm tra mật khẩu
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Password is incorrect!");
        }

        // Tạo JWT token
        String token = jwtService.generateToken(user);

        // Trả về thông tin người dùng và token
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("token", token);
        response.put("email", user.getEmail());
        response.put("role", user.getRole().toString());
        response.put("premium", user.isPremium());

        return response;
    }
}
