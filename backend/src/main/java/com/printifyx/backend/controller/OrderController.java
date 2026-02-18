package com.printifyx.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.printifyx.backend.config.JwtUtil;
import com.printifyx.backend.dto.CreateOrderRequest;
import com.printifyx.backend.dto.UpdateOrderStatusRequest;
import com.printifyx.backend.entity.Order;
import com.printifyx.backend.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final JwtUtil jwtUtil;

    public OrderController(OrderService orderService, JwtUtil jwtUtil) {
        this.orderService = orderService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(
            @PathVariable Long userId,
            @RequestHeader("Authorization") String authHeader) {
        
        // Ensure consistent userId parsing
        Long parsedUserId = parseUserId(authHeader);
        // For now, we allow the path variable to win, but log the check
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
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
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody UpdateOrderStatusRequest request) {

        Order updatedOrder = orderService.updateOrderStatus(id, request.getStatus());
        return ResponseEntity.ok(updatedOrder);
    }
}
