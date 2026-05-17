package com.bookcorner.catalog.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long productId;
    private String username;
    private String comment;
    private int rating;
}