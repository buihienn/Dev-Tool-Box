package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.BcryptService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class BcryptServiceImpl implements BcryptService {

    @Override
    public String hashString(String inputString, int saltRounds) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(saltRounds);
        return encoder.encode(inputString);
    }

    @Override
    public boolean compareStringWithHash(String inputString, String hash) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.matches(inputString, hash);
    }
}