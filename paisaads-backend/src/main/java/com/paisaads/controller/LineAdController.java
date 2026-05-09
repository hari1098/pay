package com.paisaads.controller;

import com.paisaads.dto.CreateLineAdDto;
import com.paisaads.entity.LineAd;
import com.paisaads.enums.AdStatus;
import com.paisaads.service.LineAdService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/line-ad")
@RequiredArgsConstructor
public class LineAdController {

    private final LineAdService lineAdService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<LineAd> create(
            @CurrentSecurityContext(expression = "authentication.principal") Object principal,
            @RequestBody CreateLineAdDto dto) {
        UUID userId = extractUserId(principal);
        return ResponseEntity.ok(lineAdService.createAd(userId, dto));
    }

    @GetMapping("/today")
    public ResponseEntity<List<Map<String, Object>>> getTodayLineAds(
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) Integer stateId,
            @RequestParam(required = false) Integer cityId) {
        return ResponseEntity.ok(lineAdService.getTodayLineAds(categoryId, stateId, cityId));
    }

    @GetMapping
    public ResponseEntity<List<LineAd>> findAll(
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) Integer stateId,
            @RequestParam(required = false) Integer cityId) {
        return ResponseEntity.ok(lineAdService.findAll(categoryId, stateId, cityId));
    }

    @GetMapping("/status/{statuses}")
    @PreAuthorize("hasAnyRole('EDITOR','REVIEWER','SUPER_ADMIN')")
    public ResponseEntity<List<LineAd>> findByStatuses(@PathVariable String statuses) {
        List<AdStatus> statusList = new java.util.ArrayList<>();
        for (String s : statuses.split(",")) {
            statusList.add(AdStatus.valueOf(s.trim()));
        }
        return ResponseEntity.ok(lineAdService.findAllByStatuses(statusList));
    }

    @GetMapping("/my-ads")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<LineAd>> findMyAds(
            @CurrentSecurityContext(expression = "authentication.principal") Object principal) {
        UUID userId = extractUserId(principal);
        return ResponseEntity.ok(lineAdService.findAllByUserId(userId));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<LineAd>> findByCategory(@PathVariable String categoryId) {
        return ResponseEntity.ok(lineAdService.findByCategory(categoryId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<LineAd>> search(
            @RequestParam(required = false) String text,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) AdStatus status) {
        return ResponseEntity.ok(lineAdService.searchAds(text, city, state, categoryId, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LineAd> findOne(@PathVariable String id) {
        return ResponseEntity.ok(lineAdService.findOne(id));
    }

    @PatchMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('EDITOR','SUPER_ADMIN','REVIEWER')")
    public ResponseEntity<LineAd> updateByAdmins(
            @CurrentSecurityContext(expression = "authentication.principal") Object principal,
            @PathVariable String id,
            @RequestBody CreateLineAdDto dto) {
        UUID userId = extractUserId(principal);
        return ResponseEntity.ok(lineAdService.updateAdByAdmin(userId, id, dto));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<LineAd> update(
            @CurrentSecurityContext(expression = "authentication.principal") Object principal,
            @PathVariable String id,
            @RequestBody CreateLineAdDto dto) {
        UUID userId = extractUserId(principal);
        return ResponseEntity.ok(lineAdService.updateAdByUser(userId, id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','SUPER_ADMIN')")
    public ResponseEntity<?> remove(
            @CurrentSecurityContext(expression = "authentication.principal") Object principal,
            @PathVariable String id) {
        UUID userId = extractUserId(principal);
        String role = extractRole(principal);
        LineAd ad = lineAdService.findOne(id);
        if (!"SUPER_ADMIN".equals(role) && !ad.getCustomer().getId().equals(
                lineAdService.findAllByUserId(userId).stream()
                    .filter(a -> a.getId().equals(ad.getId()))
                    .findFirst()
                    .map(a -> a.getCustomer().getId())
                    .orElse(null))) {
            return ResponseEntity.status(403).body(Map.of("message", "You can only delete your own ads"));
        }
        lineAdService.deleteAd(id, userId);
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
