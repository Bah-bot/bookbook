package com.bookcorner.catalog.service;

import com.bookcorner.catalog.dto.ProductRequest;
import com.bookcorner.catalog.dto.ProductResponse;
import com.bookcorner.catalog.entity.Category;
import com.bookcorner.catalog.entity.Product;
import com.bookcorner.catalog.repository.CategoryRepository;
import com.bookcorner.catalog.repository.ProductRepository;
import com.bookcorner.exception.ResourceNotFoundException;
import com.bookcorner.inventory.entity.Inventory;
import com.bookcorner.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryRepository inventoryRepository;

    @Override
    public List<ProductResponse> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public ProductResponse getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé : " + id));

        return toResponse(product);
    }

    @Override
    public List<ProductResponse> searchProducts(String keyword) {

        return productRepository
                .findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(keyword, keyword)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<ProductResponse> getProductsByCategory(Long categoryId) {

        return productRepository.findByCategoryId(categoryId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie non trouvée : " + request.getCategoryId()));

        Product product = Product.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .author(request.getAuthor())
                .isbn(request.getIsbn())
                .category(category)
                .build();

        product = productRepository.save(product);

        // Créer l'inventaire initial
        Inventory inventory = Inventory.builder()
                .product(product)
                .quantity(request.getInitialStock() != null ? request.getInitialStock() : 0)
                .build();
        inventoryRepository.save(inventory);

        return toResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé : " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie non trouvée : " + request.getCategoryId()));

        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setAuthor(request.getAuthor());
        product.setIsbn(request.getIsbn());
        product.setCategory(category);

        return toResponse(productRepository.save(product));
    }

    @Override
    public void deleteProduct(Long id) {

        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Produit non trouvé : " + id);
        }
        productRepository.deleteById(id);
    }

    private ProductResponse toResponse(Product product) {

        Integer stock = inventoryRepository.findByProductId(product.getId())
                .map(inv -> inv.getQuantity())
                .orElse(0);

        return ProductResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .author(product.getAuthor())
                .isbn(product.getIsbn())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .stock(stock)
                .build();
    }
}
