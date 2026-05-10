package com.bookcorner.catalog.service;

import com.bookcorner.catalog.dto.CategoryResponse;

import java.util.List;

public interface CategoryService {

    List<CategoryResponse> getAllCategories();

    CategoryResponse getCategoryById(Long id);

    CategoryResponse createCategory(String name, String description);
}
