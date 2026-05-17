package com.bookcorner.admin.controller;

import com.bookcorner.billing.dto.OrderItemResponse;
import com.bookcorner.billing.dto.OrderResponse;
import com.bookcorner.billing.entity.Order;
import com.bookcorner.billing.repository.OrderRepository;
import com.bookcorner.catalog.dto.ProductRequest;
import com.bookcorner.catalog.entity.Category;
import com.bookcorner.catalog.entity.Product;
import com.bookcorner.catalog.repository.CategoryRepository;
import com.bookcorner.catalog.repository.ProductRepository;
import com.bookcorner.catalog.repository.ReviewRepository;
import com.bookcorner.customer.repository.UserRepository;
import com.bookcorner.inventory.entity.Inventory;
import com.bookcorner.inventory.repository.InventoryRepository;
import com.bookcorner.shared.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryRepository inventoryRepository;
    private final OrderRepository orderRepository;

    // STATS
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBooks", productRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("totalOrders", orderRepository.count());
        stats.put("totalReviews", reviewRepository.count());

        double revenue = orderRepository.findAll()
                .stream().mapToDouble(Order::getTotal).sum();
        stats.put("totalRevenue", Math.round(revenue * 100.0) / 100.0);

        long pendingOrders = orderRepository.findAll()
                .stream().filter(o -> "PENDING".equals(o.getStatus())).count();
        stats.put("pendingOrders", pendingOrders);

        long lowStock = inventoryRepository.findAll()
                .stream().filter(i -> i.getQuantity() <= 5).count();
        stats.put("lowStockBooks", lowStock);

        return ResponseEntity.ok(stats);
    }

    // ORDERS
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll()
                .stream().map(this::toResponse).toList());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id,
                                               @RequestBody Map<String, String> body) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));
        order.setStatus(body.get("status"));
        orderRepository.save(order);
        return ResponseEntity.ok(new ApiResponse<>("Statut mis a jour", null));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productTitle(item.getProduct().getTitle())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .subtotal(item.getUnitPrice() * item.getQuantity())
                        .build())
                .toList();

        return OrderResponse.builder()
                .id(order.getId())
                .createdAt(order.getCreatedAt())
                .total(order.getTotal())
                .status(order.getStatus())
                .userId(order.getUser().getId())
                .userEmail(order.getUser().getEmail())
                .items(items)
                .build();
    }

    // BOOKS
    @PostMapping("/products")
    public ResponseEntity<?> createProduct(@RequestBody ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Categorie introuvable"));
        Product product = Product.builder()
                .title(request.getTitle()).author(request.getAuthor())
                .description(request.getDescription()).price(request.getPrice())
                .imageUrl(request.getImageUrl()).isbn(request.getIsbn())
                .category(category).build();
        Product saved = productRepository.save(product);
        Inventory inventory = Inventory.builder().product(saved)
                .quantity(request.getInitialStock() != null ? request.getInitialStock() : 0)
                .build();
        inventoryRepository.save(inventory);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id,
                                           @RequestBody ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Categorie introuvable"));
        product.setTitle(request.getTitle());
        product.setAuthor(request.getAuthor());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setIsbn(request.getIsbn());
        product.setCategory(category);
        productRepository.save(product);
        if (request.getInitialStock() != null) {
            inventoryRepository.findByProduct(product).ifPresent(inv -> {
                inv.setQuantity(request.getInitialStock());
                inventoryRepository.save(inv);
            });
        }
        return ResponseEntity.ok(product);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) return ResponseEntity.notFound().build();
        productRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse<>("Livre supprime", null));
    }

    // USERS
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) return ResponseEntity.notFound().build();
        userRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse<>("Utilisateur supprime", null));
    }
    // REVIEWS
    @GetMapping("/reviews")
    public ResponseEntity<?> getAllReviews() {
        return ResponseEntity.ok(reviewRepository.findAll());
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        if (!reviewRepository.existsById(id)) return ResponseEntity.notFound().build();
        reviewRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse<>("Avis supprime", null));
    }
}