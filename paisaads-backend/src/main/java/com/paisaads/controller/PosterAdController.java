package com.paisaads.controller;

import com.paisaads.dto.PosterAdDto;
import com.paisaads.enums.AdStatus;
import com.paisaads.service.PosterAdService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/poster-ad")
public class PosterAdController {

    private final PosterAdService posterAdService;

    public PosterAdController(PosterAdService posterAdService) {
        this.posterAdService = posterAdService;
    }

    @GetMapping("/today")
    public ResponseEntity<List<PosterAdDto>> getTodayAds() {
        return ResponseEntity.ok(posterAdService.getTodayAds());
    }

    @GetMapping("/my-ads")
    public ResponseEntity<List<PosterAdDto>> getMyAds(@RequestParam UUID customerId) {
        return ResponseEntity.ok(posterAdService.getMyAds(customerId));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<List<PosterAdDto>> getAdsByStatus(@PathVariable AdStatus status) {
        return ResponseEntity.ok(posterAdService.getAdsByStatus(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PosterAdDto> getAdById(@PathVariable UUID id) {
        return ResponseEntity.ok(posterAdService.getAdById(id));
    }

    @PostMapping
    public ResponseEntity<PosterAdDto> createAd(@RequestBody PosterAdDto dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(posterAdService.createAd(dto, UUID.fromString(userId)));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<PosterAdDto> approveAd(@PathVariable UUID id) {
        return ResponseEntity.ok(posterAdService.approveAd(id));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<PosterAdDto> rejectAd(@PathVariable UUID id) {
        return ResponseEntity.ok(posterAdService.rejectAd(id));
    }
}
