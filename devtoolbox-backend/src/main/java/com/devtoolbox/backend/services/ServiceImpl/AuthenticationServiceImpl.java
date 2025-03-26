package com.devtoolbox.backend.services.ServiceImpl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.devtoolbox.backend.dto.SignUpRequest;
import com.devtoolbox.backend.entities.Role;
import com.devtoolbox.backend.entities.User;
import com.devtoolbox.backend.repositories.UserRepository;
import com.devtoolbox.backend.services.AuthenticationService;

@Service
public class AuthenticationServiceImpl implements AuthenticationService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User signup(SignUpRequest signUpRequest){

        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã được sử dụng!");
        }
    
        // Kiểm tra mật khẩu không được null hoặc rỗng
        if (signUpRequest.getPassword() == null || signUpRequest.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Mật khẩu không được để trống!");
        }

        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());
        user.setRole(Role.USER);
        user.setPremium(false);
        return userRepository.save(user);
    }
}
