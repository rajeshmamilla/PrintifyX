package com.printifyx.backend.repository;

import com.printifyx.backend.entity.VariantPricing;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VariantPricingRepository extends JpaRepository<VariantPricing, Long> {
    List<VariantPricing> findByVariantId(Long variantId);
}
