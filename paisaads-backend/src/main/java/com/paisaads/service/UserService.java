package com.paisaads.service;

import com.paisaads.dto.*;
import com.paisaads.entity.*;
import com.paisaads.enums.Gender;
import com.paisaads.enums.Role;
import com.paisaads.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User createUser(String name, String email, String phoneNumber, String password, String roleStr) {
        if (userRepository.findByPhoneNumber(phoneNumber).isPresent())
            throw new IllegalArgumentException("Phone number already registered");
        if (userRepository.findByEmail(email).isPresent())
            throw new IllegalArgumentException("Email already registered");

        User user = new User();
        user.setName(name); user.setEmail(email); user.setPhoneNumber(phoneNumber);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(roleStr != null ? Role.valueOf(roleStr) : Role.USER);
        user = userRepository.save(user);

        if (user.getRole() == Role.USER) {
            Customer customer = new Customer(); customer.setUser(user);
            customerRepository.save(customer);
        } else {
            Admin admin = new Admin(); admin.setUser(user);
            adminRepository.save(admin);
        }
        return user;
    }

    @Transactional
    public void createUserWithCustomer(RegisterRequest dto) {
        if (userRepository.findByPhoneNumber(dto.getPhoneNumber()).isPresent())
            throw new IllegalArgumentException("Phone number already registered");
        if (userRepository.findByEmail(dto.getEmail()).isPresent())
            throw new IllegalArgumentException("Email already registered");

        User user = new User();
        user.setName(dto.getName()); user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setSecondaryNumber(dto.getSecondaryNumber());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.USER);
        user = userRepository.save(user);

        Customer customer = new Customer();
        customer.setUser(user); customer.setCountry(dto.getCountry());
        customer.setCountryId(dto.getCountryId()); customer.setState(dto.getState());
        customer.setStateId(dto.getStateId()); customer.setCity(dto.getCity());
        customer.setCityId(dto.getCityId());
        customer.setGender(dto.getGender() != null ? Gender.valueOf(dto.getGender()) : Gender.MALE);
        customerRepository.save(customer);
    }

    public java.util.List<User> findAll() {
        return userRepository.findAllWithRelations();
    }

    public User findOneById(UUID id) {
        return userRepository.findByIdWithRelations(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User findByPhone(String phone) {
        return userRepository.findByPhoneNumber(phone).orElse(null);
    }

    @Transactional
    public User updateUser(UUID id, UpdateUserDto dto) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getEmailVerified() != null) user.setEmailVerified(dto.getEmailVerified());
        if (dto.getPhoneVerified() != null) user.setPhoneVerified(dto.getPhoneVerified());
        return userRepository.save(user);
    }

    @Transactional
    public User updateCustomer(UUID userId, UpdateCustomerDto dto) {
        User user = userRepository.findByIdWithRelations(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Customer customer = user.getCustomer();
        if (customer == null) throw new RuntimeException("Customer not found");
        if (dto.getCountry() != null) customer.setCountry(dto.getCountry());
        if (dto.getCountryId() != null) customer.setCountryId(dto.getCountryId());
        if (dto.getState() != null) customer.setState(dto.getState());
        if (dto.getStateId() != null) customer.setStateId(dto.getStateId());
        if (dto.getCity() != null) customer.setCity(dto.getCity());
        if (dto.getCityId() != null) customer.setCityId(dto.getCityId());
        customerRepository.save(customer);
        return userRepository.findByIdWithRelations(userId).orElseThrow();
    }

    @Transactional
    public User changePassword(UUID id, String newPassword) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    @Transactional
    public Map<String, String> deactivateUser(UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(false);
        userRepository.save(user);
        return Map.of("message", "User deactivated");
    }

    @Transactional
    public Map<String, String> activateUser(UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(true);
        userRepository.save(user);
        return Map.of("message", "User activated");
    }

    @Transactional
    public Map<String, String> removeUser(UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
        return Map.of("message", "User deleted");
    }
}
