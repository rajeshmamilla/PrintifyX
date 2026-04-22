package com.printifyx.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryWithProductsDto {
    private Long id;
    private String name;
    private String slug;
    private List<ProductSummaryDto> products;
}
