package com.devtoolbox.backend.application.services;

import java.util.Map;
import com.devtoolbox.backend.application.dto.LoginRequest;
import com.devtoolbox.backend.application.dto.SignUpRequest;
import com.devtoolbox.backend.data.entities.User;

public interface AuthenticationService {
    User signup(SignUpRequest signUpRequest);
    Map<String, Object> login(LoginRequest loginRequest);
    public void verifyEmail(String token);
    void resendVerificationEmail(String email);
}
