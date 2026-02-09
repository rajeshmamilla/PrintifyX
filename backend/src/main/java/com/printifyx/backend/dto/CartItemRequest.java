package com.printifyx.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Map;

@Data
public class CartItemRequest {
    private Long productId;
    private String productName;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal totalPrice;
    private Map<String, Object> customization;
}
