package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.FavoriteToolService;
import com.devtoolbox.backend.data.entities.FavoriteTool;
import com.devtoolbox.backend.data.entities.User;
import com.devtoolbox.backend.data.repositories.FavoriteToolRepository;
import com.devtoolbox.backend.data.repositories.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class FavoriteToolServiceImpl implements FavoriteToolService {
    private final FavoriteToolRepository favoriteToolRepository;
    private final UserRepository userRepository;

    public FavoriteToolServiceImpl(FavoriteToolRepository favoriteToolRepository, UserRepository userRepository) {
        this.favoriteToolRepository = favoriteToolRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void addFavorite(Long userId, String toolId) {
        User user = userRepository.findById(userId).orElseThrow();
        if (favoriteToolRepository.findByUserAndToolId(user, toolId).isEmpty()) {
            FavoriteTool fav = new FavoriteTool();
            fav.setUser(user);
            fav.setToolId(toolId);
            favoriteToolRepository.save(fav);
        }
    }

    @Override
    @Transactional
    public void removeFavorite(Long userId, String toolId) {
        User user = userRepository.findById(userId).orElseThrow();
        favoriteToolRepository.deleteByUserAndToolId(user, toolId);
    }

    @Override
    public List<String> getFavoriteToolIds(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return favoriteToolRepository.findByUser(user)
            .stream().map(FavoriteTool::getToolId).toList();
    }

    @Override
    public boolean isFavorite(Long userId, String toolId) {
        User user = userRepository.findById(userId).orElseThrow();
        return favoriteToolRepository.findByUserAndToolId(user, toolId).isPresent();
    }
}