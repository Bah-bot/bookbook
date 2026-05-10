package com.bookcorner.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ProductRequest {

    @NotBlank(message = "Le titre est obligatoire")
    private String title;

    private String description;

    @NotNull(message = "Le prix est obligatoire")
    @Positive(message = "Le prix doit être positif")
    private Double price;

    private String imageUrl;

    private String author;

    private String isbn;

    @NotNull(message = "La catégorie est obligatoire")
    private Long categoryId;

    @Positive(message = "Le stock doit être positif")
    private Integer initialStock;
}
