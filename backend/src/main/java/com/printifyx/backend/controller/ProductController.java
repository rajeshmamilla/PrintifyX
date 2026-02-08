package com.printifyx.backend.controller;

import com.printifyx.backend.dto.ProductDetailDto;
import com.printifyx.backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailDto> getProductDetail(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductDetail(id));
    }
}
