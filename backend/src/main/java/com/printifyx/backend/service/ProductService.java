package com.printifyx.backend.service;

import com.printifyx.backend.dto.*;
import com.printifyx.backend.entity.Product;
import com.printifyx.backend.repository.ProductRepository;
import com.printifyx.backend.repository.ProductVariantRepository;
import com.printifyx.backend.repository.VariantPricingRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final VariantPricingRepository pricingRepository;

    public ProductService(ProductRepository productRepository, 
                          ProductVariantRepository variantRepository, 
                          VariantPricingRepository pricingRepository) {
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
        this.pricingRepository = pricingRepository;
    }

    public List<ProductDto> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndIsActiveTrue(categoryId).stream()
                .map(p -> new ProductDto(p.getId(), p.getName(), p.getSlug(), p.getDescription(), p.getBasePrice()))
                .collect(Collectors.toList());
    }

    public ProductDetailDto getProductDetail(Long productId) {
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        List<ProductVariantDto> variants = variantRepository.findByProductIdAndIsActiveTrue(productId).stream()
                .map(v -> {
                    List<VariantPricingDto> pricing = pricingRepository.findByVariantId(v.getId()).stream()
                            .map(pr -> new VariantPricingDto(pr.getId(), pr.getQuantity(), pr.getPrice()))
                            .collect(Collectors.toList());
                    return new ProductVariantDto(v.getId(), v.getVariantName(), v.getPrice(), pricing);
                })
                .collect(Collectors.toList());

        return new ProductDetailDto(p.getId(), p.getName(), p.getSlug(), p.getDescription(), 
                                    p.getBasePrice(), p.getCategory().getName(), variants);
    }
}
