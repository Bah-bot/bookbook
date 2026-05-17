package com.bookcorner.catalog.controller;

import com.bookcorner.catalog.dto.ReviewRequest;
import com.bookcorner.catalog.dto.ReviewResponse;
import com.bookcorner.catalog.entity.Review;
import com.bookcorner.catalog.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ReviewController {

    private final ReviewRepository reviewRepository;

    @GetMapping("/product/{productId}")
    public List<ReviewResponse> getReviews(@PathVariable Long productId) {
        return reviewRepository.findByProductId(productId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @PostMapping
    public ReviewResponse addReview(@RequestBody ReviewRequest request) {
        Review review = new Review();
        review.setProductId(request.getProductId());
        review.setUsername(request.getUsername());
        review.setComment(request.getComment());
        review.setRating(request.getRating());
        return toResponse(reviewRepository.save(review));
    }

    private ReviewResponse toResponse(Review r) {
        ReviewResponse res = new ReviewResponse();
        res.setId(r.getId());
        res.setProductId(r.getProductId());
        res.setUsername(r.getUsername());
        res.setComment(r.getComment());
        res.setRating(r.getRating());
        res.setCreatedAt(r.getCreatedAt());
        return res;
    }
}