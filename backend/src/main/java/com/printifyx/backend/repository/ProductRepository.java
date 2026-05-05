package com.printifyx.backend.repository;

import com.printifyx.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByIsActiveTrue();
    List<Product> findAllByIsActiveTrue();
    List<Product> findByCategoryIdAndIsActiveTrue(Long categoryId);
    List<Product> findByNameContainingIgnoreCaseAndIsActiveTrue(String keyword);
    java.util.Optional<Product> findBySlug(String slug);
    List<Product> findByTrendingTrueAndIsActiveTrue();

    @Query("SELECT p FROM Product p LEFT JOIN OrderItem oi ON p.id = oi.productId " +
           "WHERE p.isActive = true " +
           "GROUP BY p.id " +
           "ORDER BY COALESCE(SUM(oi.quantity), 0) DESC, p.createdAt DESC")
    List<Product> findTopTrendingProducts(Pageable pageable);
}
