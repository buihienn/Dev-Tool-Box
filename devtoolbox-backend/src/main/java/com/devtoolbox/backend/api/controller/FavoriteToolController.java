package com.devtoolbox.backend.api.controller;

import com.devtoolbox.backend.application.services.FavoriteToolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/favorite")
public class FavoriteToolController {
    @Autowired
    private FavoriteToolService favoriteToolService;

    @PostMapping("/add")
    public ResponseEntity<?> addFavorite(@RequestParam Long userId, @RequestParam String toolId) {
        favoriteToolService.addFavorite(userId, toolId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFavorite(@RequestParam Long userId, @RequestParam String toolId) {
        favoriteToolService.removeFavorite(userId, toolId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/list")
    public ResponseEntity<List<String>> getFavorites(@RequestParam Long userId) {
        return ResponseEntity.ok(favoriteToolService.getFavoriteToolIds(userId));
    }

    @GetMapping("/is-favorite")
    public ResponseEntity<Boolean> isFavorite(@RequestParam Long userId, @RequestParam String toolId) {
        return ResponseEntity.ok(favoriteToolService.isFavorite(userId, toolId));
    }
}