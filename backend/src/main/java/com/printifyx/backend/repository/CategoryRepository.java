package com.printifyx.backend.repository;

import com.printifyx.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByIsActiveTrue();
    List<Category> findAllByIsActiveTrue();
}
