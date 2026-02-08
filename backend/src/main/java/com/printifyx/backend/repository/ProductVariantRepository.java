package com.printifyx.backend.repository;

import com.printifyx.backend.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    List<ProductVariant> findByProductIdAndIsActiveTrue(Long productId);
}
