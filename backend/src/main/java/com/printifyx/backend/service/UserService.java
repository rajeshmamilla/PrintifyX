package com.printifyx.backend.service;


import org.springframework.stereotype.Service;

import com.printifyx.backend.entity.User;
import com.printifyx.backend.exception.EmailAlreadyExistsException;
import com.printifyx.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(String email, String password) {

        // check if email already exists
//        userRepository.findByEmail(email).ifPresent(u -> {
//            throw new RuntimeException("Email already registered");
//        });
        
        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyExistsException("Email already registered");
        }


        User user = new User();
       
        user.setEmail(email);
        user.setPassword(password); // ⚠️ plain text for now
      

        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password))
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
    }
}
