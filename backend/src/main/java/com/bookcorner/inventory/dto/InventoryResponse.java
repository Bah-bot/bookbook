package com.bookcorner.inventory.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InventoryResponse {

    private Long id;
    private Long productId;
    private String productTitle;
    private Integer quantity;
    private boolean available;
}
