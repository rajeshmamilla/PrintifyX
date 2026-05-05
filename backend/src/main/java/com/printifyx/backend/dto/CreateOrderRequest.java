package com.printifyx.backend.dto;

import java.math.BigDecimal;
import java.util.List;
import lombok.Data;

@Data
public class CreateOrderRequest {
    private String orderNumber;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String shippingName;
    private String shippingAddressLine1;
    private String shippingAddressLine2;
    private String shippingCity;
    private String shippingState;
    private String shippingPincode;
    private BigDecimal totalAmount;
    private String status;
    private Long userId;
    private List<CreateOrderItemRequest> items;
}
