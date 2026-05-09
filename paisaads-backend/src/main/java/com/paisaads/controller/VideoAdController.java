package com.paisaads.controller;

import com.paisaads.dto.CreateVideoAdDto;
import com.paisaads.entity.VideoAd;
import com.paisaads.enums.AdStatus;
import com.paisaads.service.VideoAdService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/video-ad")
@RequiredArgsConstructor
public class VideoAdController {

    private final VideoAdService videoAdService;

    @GetMapping("/today")
    public ResponseEntity<List<Map<String, Object>>> getVideoAdsToday(
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) Integer stateId,
            @RequestParam(required = false) Integer cityId) {
        return ResponseEntity.ok(videoAdService.getTodayVideoAds(categoryId, stateId, cityId));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<VideoAd> create(
            @CurrentSecurityContext(expression = "authentication.principal") Object principal,
            @RequestBody CreateVideoAdDto dto) {
        UUID userId = extractUserId(principal);
        return ResponseEntity.ok(videoAdService.createAd(userId, dto));
    }

    @GetMapping
    public ResponseEntity<List<VideoAd>> findAll(
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) Integer stateId,
            @RequestParam(required = false) Integer cityId) {
        return ResponseEntity.ok(videoAdService.findAll(categoryId, stateId, cityId));
    }

    @GetMapping("/status/{statuses}")
    @PreAuthorize("hasAnyRole('EDITOR','REVIEWER','SUPER_ADMIN')")
    public ResponseEntity<List<VideoAd>> findByStatuses(@PathVariable String statuses) {
        List<AdStatus> statusList = new java.util.ArrayList<>();
        for (String s : statuses.split(",")) {
            statusList.add(AdStatus.valueOf(s.trim()));
        }
        return ResponseEntity.ok(videoAdService.findAllByStatuses(statusList));
    }

    @GetMapping("/my-ads")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<VideoAd>> findMyAds(
            @CurrentSecurityContext(expression = "authentication.principal") Object principal) {
        UUID userId = extractUserId(principal);
        return ResponseEntity.ok(videoAdService.findAllByUserId(userId));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<VideoAd>> findByCategory(@PathVariable String categoryId) {
        return ResponseEntity.ok(videoAdService.findByCategory(categoryId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<VideoAd>> search(
            @RequestParam(required = false) String text,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) AdStatus status) {
        return ResponseEntity.ok(videoAdService.searchAds(text, city, state, categoryId, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VideoAd> findOne(@PathVariable String id) {
        return ResponseEntity.ok(videoAdService.findOne(id));
    }

    @PatchMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('EDITOR','SUPER_ADMIN','REVIEWER')")
    public ResponseEntity<VideoAd> updateByAdmins(
            @CurrentSecurityContext(expression = "authentication.principal") Object principal,
            @PathVariable String id,
            @RequestBody CreateVideoAdDto dto) {
        UUID userId = extractUserId(principal);
        return ResponseEntity.ok(videoAdService.updateAdByAdmin(userId, id, dto));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<VideoAd> update(
            @CurrentSecurityContext(expression = "authentication.principal") Object principal,
            @PathVariable String id,
            @RequestBody CreateVideoAdDto dto) {
        // Note: VideoAd PATCH /:id calls updateAdByAdmin (same as NestJS)
        UUID userId = extractUserId(principal);
        return ResponseEntity.ok(videoAdService.updateAdByAdmin(userId, id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','SUPER_ADMIN')")
    public ResponseEntity<?> remove(
            @CurrentSecurityContext(expression = "authentication.principal") Object principal,
            @PathVariable String id) {
        UUID userId = extractUserId(principal);
        String role = extractRole(principal);
        VideoAd ad = videoAdService.findOne(id);
        if (!"SUPER_ADMIN".equals(role) && !ad.getCustomer().getId().equals(
                videoAdService.findAllByUserId(userId).stream()
                    .filter(a -> a.getId().equals(ad.getId()))
                    .findFirst()
                    .map(a -> a.getCustomer().getId())
                    .orElse(null))) {
            return ResponseEntity.status(403).body(Map.of("message", "You can only delete your own ads"));
        }
        videoAdService.deleteAdByUser(userId, id);
        return ResponseEntity.ok(Map.of("message", "Ad deleted successfully"));
    }

    @SuppressWarnings("unchecked")
    private UUID extractUserId(Object principal) {
        if (principal instanceof Map) {
            Map<String, Object> map = (Map<String, Object>) principal;
            return UUID.fromString(map.get("sub").toString());
        }
        throw new RuntimeException("Unable to extract user ID");
    }

    @SuppressWarnings("unchecked")
    private String extractRole(Object principal) {
        if (principal instanceof Map) {
            Map<String, Object> map = (Map<String, Object>) principal;
            return map.get("role").toString();
        }
        throw new RuntimeException("Unable to extract role");
    }
}
