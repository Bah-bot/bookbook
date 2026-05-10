package com.bookcorner.customer.service;

import com.bookcorner.customer.dto.ProfileRequest;
import com.bookcorner.customer.dto.ProfileResponse;
import com.bookcorner.customer.entity.Profile;
import com.bookcorner.customer.entity.User;
import com.bookcorner.customer.repository.ProfileRepository;
import com.bookcorner.customer.repository.UserRepository;
import com.bookcorner.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    @Override
    public ProfileResponse getProfileByUserId(Long userId) {

        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profil non trouvé pour l'utilisateur : " + userId));

        return toResponse(profile);
    }

    @Override
    public ProfileResponse createOrUpdateProfile(Long userId, ProfileRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé : " + userId));

        Profile profile = profileRepository.findByUserId(userId)
                .orElse(Profile.builder().user(user).build());

        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setPhone(request.getPhone());
        profile.setAddress(request.getAddress());
        profile.setCity(request.getCity());
        profile.setCountry(request.getCountry());

        profileRepository.save(profile);

        return toResponse(profile);
    }

    private ProfileResponse toResponse(Profile profile) {

        return ProfileResponse.builder()
                .id(profile.getId())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .phone(profile.getPhone())
                .address(profile.getAddress())
                .city(profile.getCity())
                .country(profile.getCountry())
                .userId(profile.getUser().getId())
                .build();
    }
}
