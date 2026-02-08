package com.printifyx.backend.repository;

import com.printifyx.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByIsActiveTrue();
    List<Product> findAllByIsActiveTrue();
    List<Product> findByCategoryIdAndIsActiveTrue(Long categoryId);
}
