package com.printifyx.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

import com.printifyx.backend.entity.User;
import com.printifyx.backend.exception.EmailAlreadyExistsException;
import com.printifyx.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyExistsException("Email already registered");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("USER");

        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        if (passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        throw new RuntimeException("Invalid email or password");
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setRole("USER"); // Ensure role is maintained if needed, or just update password
        userRepository.save(user);
    }
}
