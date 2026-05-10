package com.bookcorner.billing.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemResponse {

    private Long id;
    private Long productId;
    private String productTitle;
    private Integer quantity;
    private Double unitPrice;
    private Double subtotal;
}