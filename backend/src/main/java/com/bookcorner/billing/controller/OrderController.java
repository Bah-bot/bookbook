package com.bookcorner.billing.controller;

import com.bookcorner.billing.dto.OrderResponse;
import com.bookcorner.billing.service.OrderService;
import com.bookcorner.shared.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<OrderResponse>> checkout(
            @RequestBody Map<String, Long> body) {

        Long userId = body.get("userId");
        OrderResponse order = orderService.checkout(userId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.<OrderResponse>builder()
                        .message("Commande validée avec succès")
                        .data(order)
                        .build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }
}