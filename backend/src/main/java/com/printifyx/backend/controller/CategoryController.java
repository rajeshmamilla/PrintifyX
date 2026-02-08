package com.printifyx.backend.controller;

import com.printifyx.backend.dto.CategoryDto;
import com.printifyx.backend.dto.ProductDto;
import com.printifyx.backend.service.CategoryService;
import com.printifyx.backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;
    private final ProductService productService;

    public CategoryController(CategoryService categoryService, ProductService productService) {
        this.categoryService = categoryService;
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllActiveCategories());
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<List<ProductDto>> getProductsByCategory(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductsByCategory(id));
    }
}
