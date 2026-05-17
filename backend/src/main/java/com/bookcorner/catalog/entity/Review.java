package com.bookcorner.catalog.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private String username;
    private String comment;
    private int rating; // 1 to 5
    private LocalDateTime createdAt = LocalDateTime.now();
}