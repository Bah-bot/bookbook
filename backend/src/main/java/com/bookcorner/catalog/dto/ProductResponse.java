package com.bookcorner.catalog.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductResponse {

    private Long id;
    private String title;
    private String description;
    private Double price;
    private String imageUrl;
    private String author;
    private String isbn;
    private Long categoryId;
    private String categoryName;
    private Integer stock;
}
