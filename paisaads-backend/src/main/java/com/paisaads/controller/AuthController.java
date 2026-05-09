package com.paisaads.controller;

import com.paisaads.dto.*;
import com.paisaads.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        return ResponseEntity.ok(authService.login(request, response));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.ok(Map.of());
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(@CurrentSecurityContext(expression = "authentication.principal") Object principal) {
        if (principal instanceof Map) {
            Map<String, Object> user = (Map<String, Object>) principal;
            return ResponseEntity.ok(authService.getProfile(user));
        }
        return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
    }

    @PostMapping("/viewer-login")
    public ResponseEntity<?> viewerLogin(@RequestBody Map<String, String> body, HttpServletResponse response) {
        return ResponseEntity.ok(authService.viewerLogin(body.get("phone"), response));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(authService.sendOtp(body.get("phone")));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body, HttpServletResponse response) {
        return ResponseEntity.ok(authService.verifyOtp(body.get("phone"), body.get("otp"), response));
    }

    @PostMapping("/send-verification-otp")
    public ResponseEntity<?> sendVerificationOtp(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(authService.sendVerificationOtp(body.get("phone")));
    }

    @PostMapping("/verify-account")
    public ResponseEntity<?> verifyAccount(@RequestBody Map<String, String> body, HttpServletResponse response) {
        return ResponseEntity.ok(authService.verifyAccount(body.get("phone"), body.get("otp"), response));
    }
}
