package com.paisaads.controller;

import com.paisaads.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/ad-dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getUserDashboard() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(dashboardService.getUserDashboard(UUID.fromString(userId)));
    }

    @GetMapping("/global")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Map<String, Object>> getGlobalDashboard() {
        return ResponseEntity.ok(dashboardService.getGlobalDashboard());
    }
}
