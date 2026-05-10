package com.bookcorner.inventory.controller;

import com.bookcorner.inventory.dto.InventoryResponse;
import com.bookcorner.inventory.service.InventoryService;
import com.bookcorner.shared.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<InventoryResponse> getStock(@PathVariable Long productId) {
        return ResponseEntity.ok(inventoryService.getStockByProduct(productId));
    }

    @PutMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<InventoryResponse>> updateStock(
            @PathVariable Long productId,
            @RequestBody Map<String, Integer> body) {

        InventoryResponse response = inventoryService.updateStock(productId, body.get("quantity"));
        return ResponseEntity.ok(ApiResponse.<InventoryResponse>builder()
                .message("Stock mis à jour")
                .data(response)
                .build());
    }
}
