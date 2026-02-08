package com.printifyx.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailDto {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private BigDecimal basePrice;
    private String categoryName;
    private List<ProductVariantDto> variants;
}
