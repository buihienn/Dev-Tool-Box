package com.devtoolbox.backend.application.services;

import java.util.List;

public interface FavoriteToolService {
    void addFavorite(Long userId, String toolId);
    void removeFavorite(Long userId, String toolId);
    List<String> getFavoriteToolIds(Long userId);
    boolean isFavorite(Long userId, String toolId);
}