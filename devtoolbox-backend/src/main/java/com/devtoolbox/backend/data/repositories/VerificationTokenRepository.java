package com.devtoolbox.backend.data.repositories;

import com.devtoolbox.backend.data.entities.VerificationToken;
import com.devtoolbox.backend.data.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);

    Optional<VerificationToken> findByUser(User user);
}