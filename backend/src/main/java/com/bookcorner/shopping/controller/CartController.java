package com.bookcorner.shopping.controller;

import com.bookcorner.shared.ApiResponse;
import com.bookcorner.shopping.dto.AddToCartRequest;
import com.bookcorner.shopping.dto.CartResponse;
import com.bookcorner.shopping.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<CartResponse> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartByUser(userId));
    }

    @PostMapping("/user/{userId}/add")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            @PathVariable Long userId,
            @Valid @RequestBody AddToCartRequest request) {

        CartResponse cart = cartService.addToCart(userId, request);
        return ResponseEntity.ok(ApiResponse.<CartResponse>builder()
                .message("Article ajouté au panier")
                .data(cart)
                .build());
    }

    @PutMapping("/user/{userId}/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateQuantity(
            @PathVariable Long userId,
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> body) {

        CartResponse cart = cartService.updateItemQuantity(userId, itemId, body.get("quantity"));
        return ResponseEntity.ok(ApiResponse.<CartResponse>builder()
                .message("Quantité mise à jour")
                .data(cart)
                .build());
    }

    @DeleteMapping("/user/{userId}/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            @PathVariable Long userId,
            @PathVariable Long itemId) {

        CartResponse cart = cartService.removeItem(userId, itemId);
        return ResponseEntity.ok(ApiResponse.<CartResponse>builder()
                .message("Article supprimé du panier")
                .data(cart)
                .build());
    }
}
