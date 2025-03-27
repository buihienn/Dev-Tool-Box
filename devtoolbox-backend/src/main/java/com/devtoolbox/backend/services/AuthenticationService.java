package com.devtoolbox.backend.services;

import com.devtoolbox.backend.dto.LoginRequest;
import com.devtoolbox.backend.dto.SignUpRequest;
import com.devtoolbox.backend.entities.User;

public interface AuthenticationService {
    User signup(SignUpRequest signUpRequest);
    String login(LoginRequest loginRequest);
}
