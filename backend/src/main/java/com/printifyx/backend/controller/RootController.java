package com.printifyx.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public Map<String, String> root() {
        return Map.of(
            "status", "UP",
            "message", "PrintifyX Backend is active and running.",
            "documentation", "Please use /api/auth/health for automated monitoring."
        );
    }

    @GetMapping("/api/health")
    public Map<String, String> apiHealth() {
        return Map.of("status", "UP");
    }
}
