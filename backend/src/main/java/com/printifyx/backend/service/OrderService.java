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
        order.setStatus(request.getStatus());
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
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        return orderRepository.save(order);
    }




}
