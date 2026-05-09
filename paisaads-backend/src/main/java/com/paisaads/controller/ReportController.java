package com.paisaads.controller;

import com.paisaads.enums.AdStatus;
import com.paisaads.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final LineAdRepository lineAdRepository;
    private final PosterAdRepository posterAdRepository;
    private final VideoAdRepository videoAdRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    public ReportController(LineAdRepository lineAdRepository,
                            PosterAdRepository posterAdRepository,
                            VideoAdRepository videoAdRepository,
                            UserRepository userRepository,
                            PaymentRepository paymentRepository) {
        this.lineAdRepository = lineAdRepository;
        this.posterAdRepository = posterAdRepository;
        this.videoAdRepository = videoAdRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
    }

    @GetMapping("/admin/user-wise-activity")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<List<Map<String, Object>>> getUserWiseActivity() {
        List<Map<String, Object>> result = new ArrayList<>();
        userRepository.findAll().forEach(user -> {
            Map<String, Object> map = new HashMap<>();
            map.put("userId", user.getId().toString());
            map.put("userName", user.getName());
            map.put("role", user.getRole().name());
            map.put("totalLineAds", lineAdRepository.countByCustomerId(
                    user.getId())); // simplified
            map.put("totalPosterAds", posterAdRepository.countByCustomerId(
                    user.getId()));
            map.put("totalVideoAds", videoAdRepository.countByCustomerId(
                    user.getId()));
            result.add(map);
        });
        return ResponseEntity.ok(result);
    }

    @GetMapping("/admin/activity-by-category")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Map<String, Object>> getActivityByCategory() {
        Map<String, Object> result = new HashMap<>();
        result.put("lineAdsByStatus", Map.of(
                "published", lineAdRepository.countByStatus(AdStatus.PUBLISHED),
                "forReview", lineAdRepository.countByStatus(AdStatus.FOR_REVIEW),
                "draft", lineAdRepository.countByStatus(AdStatus.DRAFT),
                "rejected", lineAdRepository.countByStatus(AdStatus.REJECTED),
                "onHold", lineAdRepository.countByStatus(AdStatus.ON_HOLD)
        ));
        result.put("posterAdsByStatus", Map.of(
                "published", posterAdRepository.countByStatus(AdStatus.PUBLISHED),
                "forReview", posterAdRepository.countByStatus(AdStatus.FOR_REVIEW),
                "draft", posterAdRepository.countByStatus(AdStatus.DRAFT),
                "rejected", posterAdRepository.countByStatus(AdStatus.REJECTED),
                "onHold", posterAdRepository.countByStatus(AdStatus.ON_HOLD)
        ));
        result.put("videoAdsByStatus", Map.of(
                "published", videoAdRepository.countByStatus(AdStatus.PUBLISHED),
                "forReview", videoAdRepository.countByStatus(AdStatus.FOR_REVIEW),
                "draft", videoAdRepository.countByStatus(AdStatus.DRAFT),
                "rejected", videoAdRepository.countByStatus(AdStatus.REJECTED),
                "onHold", videoAdRepository.countByStatus(AdStatus.ON_HOLD)
        ));
        return ResponseEntity.ok(result);
    }

    @GetMapping("/listings/active-by-category")
    public ResponseEntity<Map<String, Object>> getActiveListingsByCategory() {
        Map<String, Object> result = new HashMap<>();
        result.put("publishedLineAds", lineAdRepository.countByStatus(AdStatus.PUBLISHED));
        result.put("publishedPosterAds", posterAdRepository.countByStatus(AdStatus.PUBLISHED));
        result.put("publishedVideoAds", videoAdRepository.countByStatus(AdStatus.PUBLISHED));
        return ResponseEntity.ok(result);
    }

    @GetMapping("/payments/transactions")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<List<Map<String, Object>>> getPaymentTransactions() {
        List<Map<String, Object>> result = new ArrayList<>();
        paymentRepository.findAll().forEach(payment -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", payment.getId().toString());
            map.put("amount", payment.getAmount());
            map.put("paymentMethod", payment.getPaymentMethod());
            map.put("status", payment.getStatus());
            map.put("razorpayOrderId", payment.getRazorpayOrderId());
            map.put("createdAt", payment.getCreatedAt().toString());
            result.add(map);
        });
        return ResponseEntity.ok(result);
    }
}
