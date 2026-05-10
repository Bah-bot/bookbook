package com.bookcorner.customer.controller;

import com.bookcorner.customer.dto.ProfileRequest;
import com.bookcorner.customer.dto.ProfileResponse;
import com.bookcorner.customer.dto.UserResponse;
import com.bookcorner.customer.service.ProfileService;
import com.bookcorner.customer.service.UserService;
import com.bookcorner.shared.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<ProfileResponse> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.getProfileByUserId(id));
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(
            @PathVariable Long id,
            @RequestBody ProfileRequest request) {

        ProfileResponse profile = profileService.createOrUpdateProfile(id, request);
        return ResponseEntity.ok(ApiResponse.<ProfileResponse>builder()
                .message("Profil mis à jour")
                .data(profile)
                .build());
    }
}
