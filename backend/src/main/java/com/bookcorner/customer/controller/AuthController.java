package com.bookcorner.customer.controller;

import com.bookcorner.customer.dto.LoginRequest;
import com.bookcorner.customer.dto.RegisterRequest;
import com.bookcorner.customer.dto.UserResponse;
import com.bookcorner.customer.service.UserService;
import com.bookcorner.shared.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        UserResponse response = userService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.<UserResponse>builder()
                        .message("Compte créé avec succès")
                        .data(response)
                        .build());
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        UserResponse response = userService.login(request);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .message("Connexion réussie")
                .data(response)
                .build());
    }
}
