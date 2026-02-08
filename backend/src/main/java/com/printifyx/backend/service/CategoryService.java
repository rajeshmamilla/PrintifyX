package com.printifyx.backend.service;

import com.printifyx.backend.dto.CategoryDto;
import com.printifyx.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDto> getAllActiveCategories() {
        return categoryRepository.findByIsActiveTrue().stream()
                .map(cat -> new CategoryDto(cat.getId(), cat.getName(), cat.getSlug()))
                .collect(Collectors.toList());
    }
}
