package com.printifyx.backend.service;

import com.printifyx.backend.dto.ProductRequest;
import com.printifyx.backend.entity.Category;
import com.printifyx.backend.entity.Product;
import com.printifyx.backend.repository.CategoryRepository;
import com.printifyx.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class AdminProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    private final FileUploadService fileUploadService;

    public AdminProductService(ProductRepository productRepository, CategoryRepository categoryRepository, FileUploadService fileUploadService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.fileUploadService = fileUploadService;
    }

    @Transactional
    public Long createProduct(ProductRequest request, org.springframework.web.multipart.MultipartFile image) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = new Product();
        product.setCategory(category);
        product.setName(request.getName());
        product.setSlug(request.getSlug());
        product.setDescription(request.getDescription());
        product.setBasePrice(request.getBasePrice());
        product.setIsActive(true);
        
        if (image != null && !image.isEmpty()) {
            try {
                String imageUrl = fileUploadService.uploadImage(image);
                product.setImageUrl(imageUrl);
            } catch (java.io.IOException e) {
                throw new RuntimeException("Failed to upload image", e);
            }
        }
        
        return productRepository.save(product).getId();
    }

    @Transactional
    public void toggleProductStatus(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setIsActive(!product.getIsActive());
        productRepository.save(product);
    }

    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}
