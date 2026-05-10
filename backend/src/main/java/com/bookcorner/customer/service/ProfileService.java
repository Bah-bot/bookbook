package com.bookcorner.customer.service;

import com.bookcorner.customer.dto.ProfileRequest;
import com.bookcorner.customer.dto.ProfileResponse;

public interface ProfileService {

    ProfileResponse getProfileByUserId(Long userId);

    ProfileResponse createOrUpdateProfile(Long userId, ProfileRequest request);
}
