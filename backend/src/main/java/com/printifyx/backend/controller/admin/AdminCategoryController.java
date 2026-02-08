package com.printifyx.backend.controller.admin;

import com.printifyx.backend.dto.CategoryRequest;
import com.printifyx.backend.service.AdminCategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/categories")
public class AdminCategoryController {

    private final AdminCategoryService adminCategoryService;

    public AdminCategoryController(AdminCategoryService adminCategoryService) {
        this.adminCategoryService = adminCategoryService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createCategory(@RequestBody CategoryRequest request) {
        Long id = adminCategoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", id,
                "status", "CREATED"
        ));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> toggleStatus(@PathVariable Long id) {
        adminCategoryService.toggleCategoryStatus(id);
        return ResponseEntity.ok(Map.of(
                "id", id,
                "status", "UPDATED"
        ));
    }
}
