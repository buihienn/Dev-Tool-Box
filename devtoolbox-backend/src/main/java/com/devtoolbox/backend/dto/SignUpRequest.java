package com.devtoolbox.backend.dto;


import com.devtoolbox.backend.entities.Role;

// Data class
public class SignUpRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private boolean isPremium;
    private Role role;        

    // Getters
    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public boolean isPremium() {
        return isPremium;
    }

    public Role getRole() {
        return role;
    }

    // Setters
    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setPremium(boolean isPremium) {
        this.isPremium = isPremium;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}