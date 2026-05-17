package com.bookcorner.catalog.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewResponse {
    private Long id;
    private Long productId;
    private String username;
    private String comment;
    private int rating;
    private LocalDateTime createdAt;
}