package com.paisaads.service;

import com.paisaads.dto.AuthResponse;
import com.paisaads.dto.LoginRequest;
import com.paisaads.dto.RegisterRequest;
import com.paisaads.entity.Customer;
import com.paisaads.entity.User;
import com.paisaads.entity.UserRole;
import com.paisaads.repository.CustomerRepository;
import com.paisaads.repository.UserRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByPhoneNumber(request.getPhoneNumber())
                .orElseThrow(() -> new RuntimeException("Invalid phone number or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid phone number or password");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole(UserRole.USER);
        user.setActive(true);
        user.setPhoneVerified(false);
        user.setEmailVerified(false);

        User savedUser = userRepository.save(user);

        Customer customer = new Customer();
        customer.setUser(savedUser);
        customerRepository.save(customer);

        String token = jwtService.generateToken(savedUser);
        return new AuthResponse(token, savedUser);
    }

    public User getProfile(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
