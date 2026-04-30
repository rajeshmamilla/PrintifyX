package com.printifyx.backend.dto;

import java.math.BigDecimal;
import java.util.Map;
import lombok.Data;

@Data
public class CreateOrderItemRequest {
    private Long productId;
    private String productName;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal totalPrice;
    private BigDecimal price;
    private Map<String, Object> customization;
}
