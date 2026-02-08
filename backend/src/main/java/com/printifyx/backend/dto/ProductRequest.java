package com.printifyx.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
    private Long categoryId;
    private String name;
    private String slug;
    private String description;
    private BigDecimal basePrice;
}
