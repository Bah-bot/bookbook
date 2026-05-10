package com.bookcorner.shopping.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartItemResponse {

    private Long id;
    private Long productId;
    private String productTitle;
    private String productImageUrl;
    private Integer quantity;
    private Double unitPrice;
    private Double subtotal;
}
