package com.printifyx.backend.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.printifyx.backend.config.JwtUtil;
import com.printifyx.backend.entity.Address;
import com.printifyx.backend.service.AddressService;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;
    private final JwtUtil jwtUtil;

    public AddressController(AddressService addressService, JwtUtil jwtUtil) {
        this.addressService = addressService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<List<Address>> getMyAddresses(@RequestHeader("Authorization") String authHeader) {
        Long userId = parseUserId(authHeader);
        return ResponseEntity.ok(addressService.getAddressesByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<Address> addAddress(@RequestHeader("Authorization") String authHeader, @RequestBody Address address) {
        Long userId = parseUserId(authHeader);
        address.setUserId(userId);
        return ResponseEntity.ok(addressService.addAddress(address));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@RequestHeader("Authorization") String authHeader, @PathVariable Long id) {
        Long userId = parseUserId(authHeader);
        addressService.deleteAddress(id, userId);
        return ResponseEntity.noContent().build();
    }

    private Long parseUserId(String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
             throw new RuntimeException("Invalid token");
        }
        String token = authHeader;
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7).trim();
        }
        try {
            return jwtUtil.extractUserId(token);
        } catch (Exception e) {
            throw new RuntimeException("Invalid token format");
        }
    }
}
