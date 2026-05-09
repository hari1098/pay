package com.paisaads.controller;

import com.paisaads.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/ad-dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getUserDashboard(
            @CurrentSecurityContext(expression = "authentication.principal") Object principal) {
        UUID userId = extractUserId(principal);
        return ResponseEntity.ok(dashboardService.getUserDashboard(userId));
    }

    @GetMapping("/global")
    public ResponseEntity<Map<String, Object>> getGlobalDashboard() {
        return ResponseEntity.ok(dashboardService.getGlobalDashboard());
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
