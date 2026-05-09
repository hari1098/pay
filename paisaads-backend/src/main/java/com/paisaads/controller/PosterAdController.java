package com.paisaads.controller;

import com.paisaads.dto.CreatePosterAdDto;
import com.paisaads.entity.PosterAd;
import com.paisaads.enums.AdStatus;
import com.paisaads.service.PosterAdService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/poster-ad")
@RequiredArgsConstructor
public class PosterAdController {

    private final PosterAdService posterAdService;

    @GetMapping("/today")
    public ResponseEntity<List<Map<String, Object>>> getPosterAdsToday(
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) Integer stateId,
            @RequestParam(required = false) Integer cityId) {
        return ResponseEntity.ok(posterAdService.getTodayPosterAds(categoryId, stateId, cityId));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PosterAd> create(
            @CurrentSecurityContext(expression = "authentication.principal") Object principal,
            @RequestBody CreatePosterAdDto dto) {
        UUID userId = extractUserId(principal);
        return ResponseEntity.ok(posterAdService.createAd(userId, dto));
    }

    @GetMapping
    public ResponseEntity<List<PosterAd>> findAll(
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) Integer stateId,
            @RequestParam(required = false) Integer cityId) {
        return ResponseEntity.ok(posterAdService.findAll(categoryId, stateId, cityId));
    }

    @GetMapping("/status/{statuses}")
    @PreAuthorize("hasAnyRole('EDITOR','REVIEWER','SUPER_ADMIN')")
    public ResponseEntity<List<PosterAd>> findByStatuses(@PathVariable String statuses) {
        List<AdStatus> statusList = new java.util.ArrayList<>();
        for (String s : statuses.split(",")) {
            statusList.add(AdStatus.valueOf(s.trim()));
        }
        return ResponseEntity.ok(posterAdService.findAllByStatuses(statusList));
    }

    @GetMapping("/my-ads")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<PosterAd>> findMyAds(
            @CurrentSecurityContext(expression = "authentication.principal") Object principal) {
        UUID userId = extractUserId(principal);
        return ResponseEntity.ok(posterAdService.findAllByUserId(userId));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<PosterAd>> findByCategory(@PathVariable String categoryId) {
        return ResponseEntity.ok(posterAdService.findByCategory(categoryId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PosterAd>> search(
            @RequestParam(required = false) String text,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) AdStatus status) {
        return ResponseEntity.ok(posterAdService.searchAds(text, city, state, categoryId, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PosterAd> findOne(@PathVariable String id) {
        return ResponseEntity.ok(posterAdService.findOne(id));
    }

    @PatchMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('EDITOR','SUPER_ADMIN','REVIEWER')")
    public ResponseEntity<PosterAd> updateByAdmins(
            @CurrentSecurityContext(expression = "authentication.principal") Object principal,
            @PathVariable String id,
            @RequestBody CreatePosterAdDto dto) {
        UUID userId = extractUserId(principal);
        return ResponseEntity.ok(posterAdService.updateAdByAdmin(userId, id, dto));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PosterAd> update(
            @CurrentSecurityContext(expression = "authentication.principal") Object principal,
            @PathVariable String id,
            @RequestBody CreatePosterAdDto dto) {
        UUID userId = extractUserId(principal);
        return ResponseEntity.ok(posterAdService.updateAdByUser(userId, id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','SUPER_ADMIN')")
    public ResponseEntity<?> remove(
            @CurrentSecurityContext(expression = "authentication.principal") Object principal,
            @PathVariable String id) {
        UUID userId = extractUserId(principal);
        String role = extractRole(principal);
        PosterAd ad = posterAdService.findOne(id);
        if (!"SUPER_ADMIN".equals(role) && !ad.getCustomer().getId().equals(
                posterAdService.findAllByUserId(userId).stream()
                    .filter(a -> a.getId().equals(ad.getId()))
                    .findFirst()
                    .map(a -> a.getCustomer().getId())
                    .orElse(null))) {
            return ResponseEntity.status(403).body(Map.of("message", "You can only delete your own ads"));
        }
        posterAdService.deleteAd(id, userId);
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
