package com.printifyx.backend.controller.admin;

import com.printifyx.backend.dto.ProductRequest;
import com.printifyx.backend.service.AdminProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import com.printifyx.backend.entity.Product;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final AdminProductService adminProductService;

    public AdminProductController(AdminProductService adminProductService) {
        this.adminProductService = adminProductService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(adminProductService.getAllProducts());
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, Object>> createProduct(
            @RequestPart("product") ProductRequest request,
            @RequestPart(value = "image", required = false) org.springframework.web.multipart.MultipartFile image) {
        
        Long id = adminProductService.createProduct(request, image);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", id,
                "status", "CREATED"
        ));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> toggleStatus(@PathVariable Long id) {
        adminProductService.toggleProductStatus(id);
        return ResponseEntity.ok(Map.of(
                "id", id,
                "status", "UPDATED"
        ));
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, Object>> updateProduct(
            @PathVariable Long id,
            @RequestPart("product") ProductRequest request,
            @RequestPart(value = "image", required = false) org.springframework.web.multipart.MultipartFile image) {
        
        Long updatedId = adminProductService.updateProduct(id, request, image);
        return ResponseEntity.ok(Map.of(
                "id", updatedId,
                "status", "UPDATED"
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long id) {
        adminProductService.deleteProduct(id);
        return ResponseEntity.ok(Map.of(
                "id", id,
                "status", "DELETED"
        ));
    }
}
