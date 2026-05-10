package com.bookcorner.inventory.service;

import com.bookcorner.inventory.dto.InventoryResponse;
import com.bookcorner.inventory.entity.Inventory;
import com.bookcorner.inventory.repository.InventoryRepository;
import com.bookcorner.exception.ResourceNotFoundException;
import com.bookcorner.exception.StockUnavailableException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryResponse getStockByProduct(Long productId) {

        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock non trouvé pour le produit : " + productId));

        return toResponse(inventory);
    }

    @Transactional
    public InventoryResponse updateStock(Long productId, Integer quantity) {

        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock non trouvé pour le produit : " + productId));

        inventory.setQuantity(quantity);
        return toResponse(inventoryRepository.save(inventory));
    }

    @Transactional
    public void decreaseStock(Long productId, Integer quantity) {

        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock non trouvé pour le produit : " + productId));

        if (inventory.getQuantity() < quantity) {
            throw new StockUnavailableException(
                    "Stock insuffisant pour le produit " + productId +
                    ". Disponible : " + inventory.getQuantity() + ", demandé : " + quantity);
        }

        inventory.setQuantity(inventory.getQuantity() - quantity);
        inventoryRepository.save(inventory);
    }

    public boolean isAvailable(Long productId, Integer quantity) {

        return inventoryRepository.findByProductId(productId)
                .map(inv -> inv.getQuantity() >= quantity)
                .orElse(false);
    }

    private InventoryResponse toResponse(Inventory inventory) {

        return InventoryResponse.builder()
                .id(inventory.getId())
                .productId(inventory.getProduct().getId())
                .productTitle(inventory.getProduct().getTitle())
                .quantity(inventory.getQuantity())
                .available(inventory.getQuantity() > 0)
                .build();
    }
}
