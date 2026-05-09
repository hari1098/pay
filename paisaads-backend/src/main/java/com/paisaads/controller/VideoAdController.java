package com.paisaads.controller;

import com.paisaads.dto.VideoAdDto;
import com.paisaads.enums.AdStatus;
import com.paisaads.service.VideoAdService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/video-ad")
public class VideoAdController {

    private final VideoAdService videoAdService;

    public VideoAdController(VideoAdService videoAdService) {
        this.videoAdService = videoAdService;
    }

    @GetMapping("/today")
    public ResponseEntity<List<VideoAdDto>> getTodayAds() {
        return ResponseEntity.ok(videoAdService.getTodayAds());
    }

    @GetMapping("/my-ads")
    public ResponseEntity<List<VideoAdDto>> getMyAds(@RequestParam UUID customerId) {
        return ResponseEntity.ok(videoAdService.getMyAds(customerId));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<List<VideoAdDto>> getAdsByStatus(@PathVariable AdStatus status) {
        return ResponseEntity.ok(videoAdService.getAdsByStatus(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VideoAdDto> getAdById(@PathVariable UUID id) {
        return ResponseEntity.ok(videoAdService.getAdById(id));
    }

    @PostMapping
    public ResponseEntity<VideoAdDto> createAd(@RequestBody VideoAdDto dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(videoAdService.createAd(dto, UUID.fromString(userId)));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<VideoAdDto> approveAd(@PathVariable UUID id) {
        return ResponseEntity.ok(videoAdService.approveAd(id));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<VideoAdDto> rejectAd(@PathVariable UUID id) {
        return ResponseEntity.ok(videoAdService.rejectAd(id));
    }
}
