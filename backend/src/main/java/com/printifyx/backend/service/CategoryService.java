package com.printifyx.backend.service;

import com.printifyx.backend.dto.CategoryDto;
import com.printifyx.backend.dto.CategoryWithProductsDto;
import com.printifyx.backend.dto.ProductSummaryDto;
import com.printifyx.backend.repository.CategoryRepository;
import com.printifyx.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    public List<CategoryDto> getAllActiveCategories() {
        return categoryRepository.findByIsActiveTrue().stream()
                .map(cat -> new CategoryDto(cat.getId(), cat.getName(), cat.getSlug()))
                .collect(Collectors.toList());
    }

    public List<CategoryWithProductsDto> getCategoriesWithProducts() {
        return categoryRepository.findByIsActiveTrue().stream()
                .map(cat -> {
                    List<ProductSummaryDto> products = productRepository.findByCategoryIdAndIsActiveTrue(cat.getId()).stream()
                            .map(p -> new ProductSummaryDto(p.getId(), p.getName(), p.getSlug(), p.getImageUrl()))
                            .collect(Collectors.toList());
                    return new CategoryWithProductsDto(cat.getId(), cat.getName(), cat.getSlug(), products);
                })
                .collect(Collectors.toList());
    }
}
