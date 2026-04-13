package com.printifyx.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.printifyx.backend.dto.CreateOrderItemRequest;
import com.printifyx.backend.dto.CreateOrderRequest;
import com.printifyx.backend.entity.Order;
import com.printifyx.backend.entity.OrderItem;
import com.printifyx.backend.repository.OrderItemRepository;
import com.printifyx.backend.repository.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
    	

        Order order = new Order();
        order.setOrderNumber(request.getOrderNumber());
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setTotalAmount(request.getTotalAmount());
        order.setStatus(request.getStatus() != null ? request.getStatus() : "CREATED");
        order.setUserId(request.getUserId());
        order.setCreatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        for (CreateOrderItemRequest itemReq : request.getItems()) {
        	
            OrderItem item = new OrderItem();
            item.setOrder(savedOrder);
            item.setProductId(itemReq.getProductId());
            item.setProductName(itemReq.getProductName());
            item.setUnitPrice(itemReq.getUnitPrice());
            item.setQuantity(itemReq.getQuantity());
            item.setTotalPrice(itemReq.getTotalPrice());
            item.setPrice(itemReq.getPrice());
            item.setPrice(
            	    itemReq.getPrice() != null
            	        ? itemReq.getPrice()
            	        : itemReq.getUnitPrice()
            	);


            orderItemRepository.save(item);
        }

        return savedOrder;
        
    }
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    public Order updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        String currentStatus = order.getStatus();
        
        if (!isValidTransition(currentStatus, newStatus)) {
            throw new RuntimeException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    private boolean isValidTransition(String current, String next) {
        if (current.equals(next)) return true;
        if ("CANCELLED".equals(next)) {
            // Cancellation allowed only before SHIPPED
            return !"SHIPPED".equals(current) && !"DELIVERED".equals(current);
        }

        switch (current) {
            case "DRAFT":
                return "CREATED".equals(next) || "PAID".equals(next) || "PENDING".equals(next);
            case "PENDING":
                return "CREATED".equals(next) || "PAID".equals(next) || "PROCESSING".equals(next);
            case "CREATED":
                return "PAID".equals(next) || "PROCESSING".equals(next);
            case "PAID":
                return "PROCESSING".equals(next) || "SHIPPED".equals(next);
            case "PROCESSING":
                return "SHIPPED".equals(next);
            case "SHIPPED":
                return "DELIVERED".equals(next);
            case "DELIVERED":
            case "CANCELLED":
                return false;
            default:
                // For unknown legacy statuses, allow moving to CREATED safely
                return "CREATED".equals(next);
        }
    }




}
