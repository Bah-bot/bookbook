package com.bookcorner.customer.service;

import com.bookcorner.customer.dto.LoginRequest;
import com.bookcorner.customer.dto.RegisterRequest;
import com.bookcorner.customer.dto.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse register(RegisterRequest request);

    UserResponse login(LoginRequest request);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);
}
