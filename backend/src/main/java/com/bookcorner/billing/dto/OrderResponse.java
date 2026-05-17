package com.bookcorner.billing.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {

    private Long id;
    private LocalDateTime createdAt;
    private Double total;
    private String status;
    private Long userId;
    private String userEmail;
    private List<OrderItemResponse> items;
}