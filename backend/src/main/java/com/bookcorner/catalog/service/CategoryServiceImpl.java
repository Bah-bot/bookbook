package com.bookcorner.catalog.service;

import com.bookcorner.catalog.dto.CategoryResponse;
import com.bookcorner.catalog.entity.Category;
import com.bookcorner.catalog.repository.CategoryRepository;
import com.bookcorner.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponse> getAllCategories() {

        return categoryRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie non trouvée : " + id));

        return toResponse(category);
    }

    @Override
    public CategoryResponse createCategory(String name, String description) {

        Category category = Category.builder()
                .name(name)
                .description(description)
                .build();

        return toResponse(categoryRepository.save(category));
    }

    private CategoryResponse toResponse(Category category) {

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }
}
