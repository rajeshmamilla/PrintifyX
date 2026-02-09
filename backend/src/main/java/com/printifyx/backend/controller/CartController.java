package com.printifyx.backend.controller;

import com.printifyx.backend.dto.CartItemRequest;
import com.printifyx.backend.dto.CartResponse;
import com.printifyx.backend.entity.Order;
import com.printifyx.backend.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@RequestHeader("Authorization") String userId) {
        return ResponseEntity.ok(cartService.getCart(Long.parseLong(userId)));
    }

    @PostMapping("/items")
    public ResponseEntity<Void> addItem(@RequestHeader("Authorization") String userId, @RequestBody CartItemRequest request) {
        cartService.addItemToCart(Long.parseLong(userId), request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/items/{id}")
    public ResponseEntity<Void> updateQuantity(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        cartService.updateItemQuantity(id, body.get("quantity"));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> removeItem(@PathVariable Long id) {
        cartService.removeItem(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getCount(@RequestHeader("Authorization") String userId) {
        return ResponseEntity.ok(cartService.getCartCount(Long.parseLong(userId)));
    }

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(@RequestHeader("Authorization") String userId) {
        return ResponseEntity.ok(cartService.checkout(Long.parseLong(userId)));
    }
}
