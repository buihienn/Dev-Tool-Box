package com.devtoolbox.backend.data.entities;
import jakarta.persistence.*;


@Entity
@Table(name = "categories")
public class Category {

    @Id
    private String id; // ID của danh mục (ví dụ: 'crypto')

    @Column(nullable = false)
    private String name;

    @Column(name = "icon_url")
    private String iconUrl;

    @Column
    private String description;

    // Getters và Setters
    public Category() {
    }
    public Category(String id, String name, String iconUrl, String description) {
        this.id = id;
        this.name = name;
        this.iconUrl = iconUrl;
        this.description = description;
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getIconUrl() {
        return iconUrl;
    }
    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

}