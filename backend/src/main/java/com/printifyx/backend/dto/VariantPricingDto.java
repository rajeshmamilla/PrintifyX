package com.printifyx.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VariantPricingDto {
    private Long id;
    private Integer quantity;
    private BigDecimal price;
}
