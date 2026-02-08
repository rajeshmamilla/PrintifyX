package com.printifyx.backend.service;

import com.printifyx.backend.dto.ProductRequest;
import com.printifyx.backend.entity.Category;
import com.printifyx.backend.entity.Product;
import com.printifyx.backend.repository.CategoryRepository;
import com.printifyx.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public AdminProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public Long createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = new Product();
        product.setCategory(category);
        product.setName(request.getName());
        product.setSlug(request.getSlug());
        product.setDescription(request.getDescription());
        product.setBasePrice(request.getBasePrice());
        product.setIsActive(true);
        
        return productRepository.save(product).getId();
    }

    @Transactional
    public void toggleProductStatus(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setIsActive(!product.getIsActive());
        productRepository.save(product);
    }
}
