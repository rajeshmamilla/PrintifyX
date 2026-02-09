package com.printifyx.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    private Long id;
    private Long userId;
    private List<CartItemDto> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemDto {
        private Long id;
        private Long productId;
        private String productName;
        private java.math.BigDecimal unitPrice;
        private Integer quantity;
        private java.math.BigDecimal totalPrice;
        private java.util.Map<String, Object> customization;
    }
}
