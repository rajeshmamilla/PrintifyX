package com.printifyx.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantDto {
    private Long id;
    private String variantName;
    private BigDecimal price;
    private List<VariantPricingDto> pricing;
}
