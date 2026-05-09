package com.paisaads.controller;

import com.paisaads.dto.*;
import com.paisaads.entity.User;
import com.paisaads.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUser(@CurrentSecurityContext(expression = "authentication.principal") Object principal) {
        return ResponseEntity.ok(principal);
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> create(@RequestBody Map<String, String> body) {
        User user = userService.createUser(body.get("name"), body.get("email"), body.get("phoneNumber"), body.get("password"), body.get("role"));
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register-customer")
    public ResponseEntity<?> registerCustomer(@RequestBody RegisterRequest dto) {
        userService.createUserWithCustomer(dto);
        return ResponseEntity.ok(Map.of("message", "User & customer created successfully"));
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('EDITOR') or hasRole('REVIEWER')")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/customer/me")
    public ResponseEntity<?> findCustomer(@CurrentSecurityContext(expression = "authentication.principal") Object principal) {
        if (principal instanceof Map) {
            Map<String, Object> user = (Map<String, Object>) principal;
            String userId = (String) user.get("sub");
            if (userId != null) {
                User u = userService.findOneById(UUID.fromString(userId));
                return ResponseEntity.ok(u.getCustomer());
            }
        }
        return ResponseEntity.status(401).build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('EDITOR') or hasRole('REVIEWER')")
    public ResponseEntity<?> findOne(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.findOneById(id));
    }

    @GetMapping("/phone/{phone}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('EDITOR') or hasRole('REVIEWER')")
    public ResponseEntity<?> findByPhone(@PathVariable String phone) {
        User user = userService.findByPhone(phone);
        if (user == null) return ResponseEntity.ok(Map.of("message", "User not found"));
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/me")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('EDITOR') or hasRole('REVIEWER') or hasRole('USER')")
    public ResponseEntity<?> updateMe(@CurrentSecurityContext(expression = "authentication.principal") Object principal, @RequestBody UpdateUserDto dto) {
        if (principal instanceof Map) {
            Map<String, Object> user = (Map<String, Object>) principal;
            String userId = (String) user.get("sub");
            if (userId != null) return ResponseEntity.ok(userService.updateUser(UUID.fromString(userId), dto));
        }
        return ResponseEntity.status(401).build();
    }

    @PostMapping("/update-customer/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable UUID id, @RequestBody UpdateCustomerDto dto) {
        return ResponseEntity.ok(userService.updateCustomer(id, dto));
    }

    @PatchMapping("/me/password")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('EDITOR') or hasRole('REVIEWER') or hasRole('USER')")
    public ResponseEntity<?> changePasswordMe(@CurrentSecurityContext(expression = "authentication.principal") Object principal, @RequestBody Map<String, String> body) {
        if (principal instanceof Map) {
            Map<String, Object> user = (Map<String, Object>) principal;
            String userId = (String) user.get("sub");
            if (userId != null) return ResponseEntity.ok(userService.changePassword(UUID.fromString(userId), body.get("password")));
        }
        return ResponseEntity.status(401).build();
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> deactivate(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.deactivateUser(id));
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> activate(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.activateUser(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> remove(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.removeUser(id));
    }
}
