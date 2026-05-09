package com.paisaads.service;

import com.paisaads.dto.*;
import com.paisaads.entity.*;
import com.paisaads.enums.Role;
import com.paisaads.repository.*;
import com.paisaads.security.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;
    private final OtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public Map<String, Object> login(LoginRequest request, HttpServletResponse response) {
        Optional<User> userOpt = userRepository.findByPhoneOrEmailWithPassword(request.getEmailOrPhone());
        
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        User user = userOpt.get();
        String token = jwtUtil.generateToken(user.getId(), user.getName(), user.role.name(), user.getPhoneVerified(), user.getPhoneNumber());

        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(3 * 24 * 60 * 60); // 3 days
        response.addCookie(cookie);

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("name", user.getName());
        userMap.put("email", user.getEmail());
        userMap.put("phoneNumber", user.getPhoneNumber());
        userMap.put("role", user.getRole().name());
        userMap.put("phoneVerified", user.getPhoneVerified());

        return Map.of("response", "ok", "user", userMap);
    }

    public void logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    public Map<String, Object> getProfile(Map<String, Object> currentUser) {
        String role = (String) currentUser.get("role");
        if ("VIEWER".equals(role)) {
            return Map.of("id", null, "name", null, "phone_number", currentUser.get("phone"), "role", "VIEWER");
        }
        String userId = (String) currentUser.get("sub");
        if (userId == null) throw new IllegalArgumentException("User not found");
        User user = userRepository.findByIdWithRelations(UUID.fromString(userId))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Map<String, Object> result = new HashMap<>();
        result.put("id", user.getId());
        result.put("name", user.getName());
        result.put("email", user.getEmail());
        result.put("phoneNumber", user.getPhoneNumber());
        result.put("role", user.getRole().name());
        result.put("phoneVerified", user.getPhoneVerified());
        if (user.getCustomer() != null) result.put("customer", user.getCustomer());
        if (user.getAdmin() != null) result.put("admin", user.getAdmin());
        return result;
    }

    public Map<String, Object> viewerLogin(String phone, HttpServletResponse response) {
        String token = jwtUtil.generateViewerToken(phone);
        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true); cookie.setSecure(false); cookie.setPath("/");
        cookie.setMaxAge(3 * 24 * 60 * 60);
        response.addCookie(cookie);

        Map<String, Object> user = new HashMap<>();
        user.put("id", null); user.put("name", null); user.put("phone_number", phone); user.put("role", "VIEWER");
        return Map.of("message", "Viewer login successful", "user", user);
    }

    public Map<String, String> sendOtp(String phone) {
        if (phone == null || phone.isBlank()) throw new IllegalArgumentException("Phone number is required");
        
        Optional<User> userOpt = userRepository.findByPhoneNumber(phone);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getRole() == Role.SUPER_ADMIN || user.getRole() == Role.EDITOR || user.getRole() == Role.REVIEWER) {
                throw new IllegalArgumentException("Admin users should use regular login, not OTP");
            }
        }

        // Invalidate existing OTPs
        otpRepository.findByPhoneNumberAndPurposeAndIsVerifiedFalseAndIsActiveTrue(phone, "LOGIN")
                .ifPresent(otp -> { otp.setIsActive(false); otpRepository.save(otp); });

        String otpCode = String.valueOf(100000 + new Random().nextInt(900000));
        Otp otp = new Otp();
        otp.setPhoneNumber(phone); otp.setOtpCode(otpCode);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otp.setPurpose("LOGIN");
        otp.setUser(userOpt.orElse(null));
        otpRepository.save(otp);

        return Map.of("message", "OTP sent successfully");
    }

    public Map<String, Object> verifyOtp(String phone, String otpCode, HttpServletResponse response) {
        if (phone == null || phone.isBlank() || otpCode == null || otpCode.isBlank()) {
            throw new IllegalArgumentException("Phone number and OTP are required");
        }

        Optional<Otp> otpOpt = otpRepository.findByPhoneNumberAndOtpCodeAndPurposeAndIsVerifiedFalseAndIsActiveTrue(phone, otpCode, "LOGIN");
        if (otpOpt.isEmpty()) throw new IllegalArgumentException("Invalid or expired OTP");

        Otp otp = otpOpt.get();
        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) throw new IllegalArgumentException("Invalid or expired OTP");

        otp.setIsVerified(true);
        otpRepository.save(otp);

        // Invalidate all OTPs for this phone
        otpRepository.findByPhoneNumberAndPurposeAndIsVerifiedFalseAndIsActiveTrue(phone, "LOGIN")
                .ifPresent(o -> { o.setIsActive(false); otpRepository.save(o); });

        String token;
        Map<String, Object> userMap = new HashMap<>();
        if (otp.getUser() != null) {
            User user = otp.getUser();
            token = jwtUtil.generateToken(user.getId(), user.getName(), user.getRole().name(), user.getPhoneVerified(), user.getPhoneNumber());
            userMap.put("id", user.getId()); userMap.put("name", user.getName());
            userMap.put("phone_number", user.getPhoneNumber()); userMap.put("role", user.getRole().name());
        } else {
            token = jwtUtil.generateViewerToken(phone);
            userMap.put("id", null); userMap.put("name", null); userMap.put("phone_number", phone); userMap.put("role", "VIEWER");
        }

        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true); cookie.setSecure(false); cookie.setPath("/");
        cookie.setMaxAge(3 * 24 * 60 * 60);
        response.addCookie(cookie);

        return Map.of("message", "OTP verified successfully");
    }

    public Map<String, String> sendVerificationOtp(String phone) {
        if (phone == null || phone.isBlank()) throw new IllegalArgumentException("Phone number is required");
        User user = userRepository.findByPhoneNumber(phone).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (user.getPhoneVerified()) throw new IllegalArgumentException("Phone number is already verified");

        String otpCode = String.valueOf(100000 + new Random().nextInt(900000));
        Otp otp = new Otp();
        otp.setPhoneNumber(phone); otp.setOtpCode(otpCode);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otp.setPurpose("PHONE_VERIFICATION"); otp.setUser(user);
        otpRepository.save(otp);

        return Map.of("message", "Verification OTP sent to your phone");
    }

    public Map<String, Object> verifyAccount(String phone, String otpCode, HttpServletResponse response) {
        if (phone == null || phone.isBlank() || otpCode == null || otpCode.isBlank()) {
            throw new IllegalArgumentException("Phone number and OTP are required");
        }

        Optional<Otp> otpOpt = otpRepository.findByPhoneNumberAndOtpCodeAndPurposeAndIsVerifiedFalseAndIsActiveTrue(phone, otpCode, "PHONE_VERIFICATION");
        if (otpOpt.isEmpty() || otpOpt.get().getUser() == null) throw new IllegalArgumentException("Invalid or expired verification OTP");

        Otp otp = otpOpt.get();
        otp.setIsVerified(true); otpRepository.save(otp);

        User user = otp.getUser();
        user.setPhoneVerified(true); userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getName(), user.getRole().name(), true, user.getPhoneNumber());
        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true); cookie.setSecure(false); cookie.setPath("/");
        cookie.setMaxAge(3 * 24 * 60 * 60);
        response.addCookie(cookie);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId()); userData.put("name", user.getName());
        userData.put("phone_number", user.getPhoneNumber()); userData.put("role", user.getRole().name());
        userData.put("phone_verified", true);

        return Map.of("message", "Phone number verified successfully", "user", userData);
    }
}
