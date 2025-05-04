package com.devtoolbox.backend.data.repositories;

import com.devtoolbox.backend.data.entities.FavoriteTool;
import com.devtoolbox.backend.data.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteToolRepository extends JpaRepository<FavoriteTool, Long> {
    List<FavoriteTool> findByUser(User user);
    Optional<FavoriteTool> findByUserAndToolId(User user, String toolId);
    void deleteByUserAndToolId(User user, String toolId);
}