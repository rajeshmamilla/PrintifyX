package com.printifyx.backend.service;

import com.printifyx.backend.dto.CartItemRequest;
import com.printifyx.backend.dto.CartResponse;
import com.printifyx.backend.dto.CreateOrderItemRequest;
import com.printifyx.backend.dto.CreateOrderRequest;
import com.printifyx.backend.entity.Cart;
import com.printifyx.backend.entity.CartItem;
import com.printifyx.backend.entity.Order;
import com.printifyx.backend.repository.CartItemRepository;
import com.printifyx.backend.repository.CartRepository;
import com.printifyx.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderService orderService;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository, 
                       CartItemRepository cartItemRepository, 
                       OrderService orderService,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserId(userId);
                    return cartRepository.save(newCart);
                });
    }

    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return mapToResponse(cart);
    }

    @Transactional
    public void addItemToCart(Long userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        
        // Check if item with same productId and customization already exists
        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(request.getProductId()) && 
                        ( (item.getCustomization() == null && request.getCustomization() == null) || 
                          (item.getCustomization() != null && item.getCustomization().equals(request.getCustomization())) ))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            // Update existing item
            int newQuantity = existingItem.getQuantity() + request.getQuantity();
            existingItem.setQuantity(newQuantity);
            existingItem.setTotalPrice(existingItem.getUnitPrice().multiply(new BigDecimal(newQuantity)));
        } else {
            // Create new item
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProductId(request.getProductId());
            item.setProductName(request.getProductName());
            item.setUnitPrice(request.getUnitPrice());
            item.setQuantity(request.getQuantity());
            item.setTotalPrice(request.getTotalPrice());
            item.setCustomization(request.getCustomization());
            cart.getItems().add(item);
        }
        
        cartRepository.save(cart);
    }

    @Transactional
    public void updateItemQuantity(Long itemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        item.setQuantity(quantity);
        item.setTotalPrice(item.getUnitPrice().multiply(new BigDecimal(quantity)));
        cartItemRepository.save(item);
    }

    @Transactional
    public void removeItem(Long itemId) {
        cartItemRepository.deleteById(itemId);
    }

    @Transactional(readOnly = true)
    public long getCartCount(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart == null) return 0;
        return cart.getItems().stream()
                .map(CartItem::getProductId)
                .distinct()
                .count();
    }

    @Transactional
    public Order checkout(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        com.printifyx.backend.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CreateOrderRequest orderRequest = new CreateOrderRequest();
        orderRequest.setUserId(userId);
        orderRequest.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        orderRequest.setCustomerName(user.getEmail().split("@")[0]); // Fallback name
        orderRequest.setCustomerEmail(user.getEmail());
        orderRequest.setCustomerPhone("0000000000"); // Placeholder
        orderRequest.setStatus("PENDING");
        
        BigDecimal total = cart.getItems().stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        orderRequest.setTotalAmount(total);

        List<CreateOrderItemRequest> orderItems = cart.getItems().stream().map(cartItem -> {
            CreateOrderItemRequest orderItem = new CreateOrderItemRequest();
            orderItem.setProductId(cartItem.getProductId());
            orderItem.setProductName(cartItem.getProductName());
            orderItem.setUnitPrice(cartItem.getUnitPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setTotalPrice(cartItem.getTotalPrice());
            orderItem.setPrice(cartItem.getUnitPrice()); // Compatibility with existing field
            return orderItem;
        }).collect(Collectors.toList());

        orderRequest.setItems(orderItems);

        Order order = orderService.createOrder(orderRequest);

        // Clear cart
        cart.getItems().clear();
        cartRepository.save(cart);

        return order;
    }

    private CartResponse mapToResponse(Cart cart) {
        List<CartResponse.CartItemDto> items = cart.getItems().stream()
                .map(item -> new CartResponse.CartItemDto(
                        item.getId(),
                        item.getProductId(),
                        item.getProductName(),
                        item.getUnitPrice(),
                        item.getQuantity(),
                        item.getTotalPrice(),
                        item.getCustomization()
                )).collect(Collectors.toList());
        
        return new CartResponse(cart.getId(), cart.getUserId(), items);
    }
}
