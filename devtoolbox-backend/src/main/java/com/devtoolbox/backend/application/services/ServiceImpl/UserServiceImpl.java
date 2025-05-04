package com.devtoolbox.backend.application.services.ServiceImpl;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.devtoolbox.backend.application.services.UserService;
import com.devtoolbox.backend.data.repositories.UserRepository;
import com.devtoolbox.backend.data.entities.User;



@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetailsService userDetailsService(){
        return new UserDetailsService(){
            @Override
            public UserDetails loadUserByUsername(String email) {
                return userRepository.findByEmail(email)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
            }
        };
    }

    @Override
    public void upgradePremium(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setPremium(true);
        userRepository.save(user);
    }

    @Override
    public boolean isPremium(Long userId) {
        return userRepository.findById(userId)
            .map(User::isPremium)
            .orElse(false);
    }
}