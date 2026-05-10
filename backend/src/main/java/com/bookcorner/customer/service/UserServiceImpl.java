package com.bookcorner.customer.service;

import com.bookcorner.customer.dto.LoginRequest;
import com.bookcorner.customer.dto.RegisterRequest;
import com.bookcorner.customer.dto.UserResponse;
import com.bookcorner.customer.entity.User;
import com.bookcorner.customer.repository.UserRepository;
import com.bookcorner.exception.BadRequestException;
import com.bookcorner.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Cet email est déjà utilisé : " + request.getEmail());
        }

        // NOTE : En production, hashер le mot de passe avec BCrypt
        User user = User.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .role("USER")
                .build();

        userRepository.save(user);

        return toResponse(user);
    }

    @Override
    public UserResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Email ou mot de passe incorrect"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new BadRequestException("Email ou mot de passe incorrect");
        }

        return toResponse(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'id : " + id));

        return toResponse(user);
    }

    private UserResponse toResponse(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
