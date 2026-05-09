package com.paisaads.controller;

import com.paisaads.dto.CreateAdCommentDto;
import com.paisaads.entity.AdComment;
import com.paisaads.enums.AdStatus;
import com.paisaads.enums.AdType;
import com.paisaads.service.AdCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/ad-comments")
@RequiredArgsConstructor
public class AdCommentController {

    private final AdCommentService adCommentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<AdComment> create(
            @CurrentSecurityContext(expression = "authentication.principal") Object principal,
            @RequestBody CreateAdCommentDto dto) {
        UUID userId = extractUserId(principal);
        return ResponseEntity.ok(adCommentService.create(dto, userId));
    }

    @GetMapping("/ad/{adType}/{adId}")
    public ResponseEntity<List<AdComment>> findAllForAd(
            @PathVariable String adType,
            @PathVariable String adId,
            @RequestParam(required = false) String actionType,
            @RequestParam(required = false) Boolean history) {
        boolean isActive = history == null || !history;
        return ResponseEntity.ok(adCommentService.findAllForAd(adId, actionType, adType, isActive));
    }

    @PostMapping("/send-for-review/{adType}/{adId}")
    public ResponseEntity<Map<String, String>> sendForReview(
            @PathVariable String adType,
            @PathVariable String adId) {
        adCommentService.sendForReview(adId, adType);
        return ResponseEntity.ok(Map.of("message", "Ad sent for review"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdComment> findOne(@PathVariable String id) {
        return ResponseEntity.ok(adCommentService.findOne(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AdComment> update(
            @PathVariable String id,
            @RequestBody CreateAdCommentDto dto) {
        return ResponseEntity.ok(adCommentService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> remove(@PathVariable String id) {
        adCommentService.remove(id);
        return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
    }

    @SuppressWarnings("unchecked")
    private UUID extractUserId(Object principal) {
        if (principal instanceof Map) {
            Map<String, Object> map = (Map<String, Object>) principal;
            return UUID.fromString(map.get("sub").toString());
        }
        throw new RuntimeException("Unable to extract user ID");
    }
}
