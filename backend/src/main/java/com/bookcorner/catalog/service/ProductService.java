package com.bookcorner.catalog.service;

import com.bookcorner.catalog.dto.ProductRequest;
import com.bookcorner.catalog.dto.ProductResponse;

import java.util.List;

public interface ProductService {

    List<ProductResponse> getAllProducts();

    ProductResponse getProductById(Long id);

    List<ProductResponse> searchProducts(String keyword);

    List<ProductResponse> getProductsByCategory(Long categoryId);

    ProductResponse createProduct(ProductRequest request);

    ProductResponse updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);
}
