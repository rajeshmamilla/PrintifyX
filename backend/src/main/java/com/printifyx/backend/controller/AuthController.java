package com.printifyx.backend.controller;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.printifyx.backend.config.JwtUtil;
import com.printifyx.backend.dto.*;
import com.printifyx.backend.entity.User;
import com.printifyx.backend.service.OtpService;
import com.printifyx.backend.service.UserService;
import org.springframework.http.ResponseEntity;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final OtpService otpService;

    public AuthController(UserService userService, AuthenticationManager authenticationManager, 
                          JwtUtil jwtUtil, UserDetailsService userDetailsService,
                          OtpService otpService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.otpService = otpService;
    }

    @PostMapping("/send-register-otp")
    public ResponseEntity<?> sendRegisterOtp(@RequestBody OtpRequest request) {
        // Check if user already exists
        if (userService.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already registered"));
        }
        otpService.sendOtp(request.getEmail(), "REGISTRATION");
        return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
    }

    @PostMapping("/send-forgot-otp")
    public ResponseEntity<?> sendForgotOtp(@RequestBody OtpRequest request) {
        // Check if user exists
        if (userService.findByEmail(request.getEmail()).isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email not found"));
        }
        otpService.sendOtp(request.getEmail(), "FORGOT_PASSWORD");
        return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtpCode(), request.getPurpose());
        if (isValid) {
            return ResponseEntity.ok(Map.of("message", "OTP verified successfully", "verified", true));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired OTP", "verified", false));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        // Verify that the email was successfully verified for FORGOT_PASSWORD
        if (!otpService.isEmailVerified(request.getEmail(), "FORGOT_PASSWORD")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email verification required"));
        }
        
        userService.resetPassword(request.getEmail(), request.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Verify that the email was successfully verified for REGISTRATION
        if (!otpService.isEmailVerified(request.getEmail(), "REGISTRATION")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email verification required"));
        }

        User user = userService.registerUser(
                request.getEmail(),
                request.getPassword()
        );
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userService.loginUser(request.getEmail(), request.getPassword());
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails, user.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        
        return response;
    }
}
