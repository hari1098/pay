package com.paisaads.controller;

import com.paisaads.dto.LineAdDto;
import com.paisaads.enums.AdStatus;
import com.paisaads.service.LineAdService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/line-ad")
public class LineAdController {

    private final LineAdService lineAdService;

    public LineAdController(LineAdService lineAdService) {
        this.lineAdService = lineAdService;
    }

    @GetMapping("/today")
    public ResponseEntity<List<LineAdDto>> getTodayAds() {
        return ResponseEntity.ok(lineAdService.getTodayAds());
    }

    @GetMapping("/my-ads")
    public ResponseEntity<List<LineAdDto>> getMyAds(@RequestParam UUID customerId) {
        return ResponseEntity.ok(lineAdService.getMyAds(customerId));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<List<LineAdDto>> getAdsByStatus(@PathVariable AdStatus status) {
        return ResponseEntity.ok(lineAdService.getAdsByStatus(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LineAdDto> getAdById(@PathVariable UUID id) {
        return ResponseEntity.ok(lineAdService.getAdById(id));
    }

    @PostMapping
    public ResponseEntity<LineAdDto> createAd(@RequestBody LineAdDto dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(lineAdService.createAd(dto, UUID.fromString(userId)));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<LineAdDto> approveAd(@PathVariable UUID id) {
        return ResponseEntity.ok(lineAdService.approveAd(id));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<LineAdDto> rejectAd(@PathVariable UUID id) {
        return ResponseEntity.ok(lineAdService.rejectAd(id));
    }
}
