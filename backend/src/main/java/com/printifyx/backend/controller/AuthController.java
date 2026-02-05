package com.printifyx.backend.controller;

import com.printifyx.backend.dto.RegisterRequest;
import com.printifyx.backend.entity.User;
import com.printifyx.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {
        return userService.registerUser(
                request.getName(),
                request.getEmail(),
                request.getPassword()
        );
    }
}
