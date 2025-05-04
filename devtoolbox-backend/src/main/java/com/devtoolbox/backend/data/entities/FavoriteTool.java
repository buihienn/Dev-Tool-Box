package com.devtoolbox.backend.data.entities;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "favorite_tool", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "tool_id"}))
public class FavoriteTool implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "tool_id", nullable = false)
    private String toolId;

    public FavoriteTool() {}

    public FavoriteTool(User user, String toolId) {
        this.user = user;
        this.toolId = toolId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getToolId() {
        return toolId;
    }

    public void setToolId(String toolId) {
        this.toolId = toolId;
    }
}