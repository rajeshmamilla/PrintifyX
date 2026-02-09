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

    @PostMapping
    public ResponseEntity<Map<String, Object>> createProduct(@RequestBody ProductRequest request) {
        Long id = adminProductService.createProduct(request);
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
}
