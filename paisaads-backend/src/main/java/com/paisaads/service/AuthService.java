package com.paisaads.service;

import com.paisaads.dto.LoginRequest;
import com.paisaads.dto.LoginResponse;
import com.paisaads.dto.RegisterRequest;
import com.paisaads.dto.UserProfileDto;
import com.paisaads.entity.Customer;
import com.paisaads.entity.User;
import com.paisaads.enums.Role;
import com.paisaads.repository.CustomerRepository;
import com.paisaads.repository.UserRepository;
import com.paisaads.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       CustomerRepository customerRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByPhoneNumber(request.getPhoneNumber())
                .orElseThrow(() -> new RuntimeException("Invalid phone number or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid phone number or password");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        String token = jwtUtil.generateToken(
                user.getId().toString(),
                user.getPhoneNumber(),
                user.getRole().name()
        );

        UserProfileDto userProfile = toUserProfileDto(user);

        return new LoginResponse(token, userProfile);
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already registered");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setIsActive(true);
        user.setEmailVerified(false);
        user.setPhoneVerified(false);

        user = userRepository.save(user);

        // Create customer record
        Customer customer = new Customer();
        customer.setUser(user);
        customerRepository.save(customer);

        String token = jwtUtil.generateToken(
                user.getId().toString(),
                user.getPhoneNumber(),
                user.getRole().name()
        );

        UserProfileDto userProfile = toUserProfileDto(user);

        return new LoginResponse(token, userProfile);
    }

    public UserProfileDto getProfile(String userId) {
        User user = userRepository.findById(java.util.UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toUserProfileDto(user);
    }

    private UserProfileDto toUserProfileDto(User user) {
        return new UserProfileDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole(),
                user.getIsActive(),
                user.getEmailVerified(),
                user.getPhoneVerified()
        );
    }
}
