package com.paisaads.controller;

import com.paisaads.dto.AdvancedFilterDto;
import com.paisaads.enums.AdStatus;
import com.paisaads.enums.AdType;
import com.paisaads.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/line-ad-stats")
    public ResponseEntity<Object> getLineAdStats() {
        return ResponseEntity.ok(reportService.getLineAdStats());
    }

    @GetMapping("/line-ads")
    public ResponseEntity<Object> getLineAdsByStatusAndTimeFrame(
            @RequestParam AdStatus status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(reportService.getLineAdsByStatusAndTimeFrame(
            status, startDate, endDate, page, limit));
    }

    @GetMapping("/ad-stats")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Object> getAdStats(
            @RequestParam AdType type,
            @RequestParam AdStatus status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return ResponseEntity.ok(reportService.getAdStats(type, status, page, limit));
    }

    @GetMapping("/filtered-ads")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Object> getFilteredAds(AdvancedFilterDto filters) {
        return ResponseEntity.ok(reportService.getFilteredAds(filters));
    }

    @GetMapping("/filtered-stats")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Object> getFilteredAdStats(AdvancedFilterDto filters) {
        return ResponseEntity.ok(reportService.getFilteredAdStats(filters));
    }

    @GetMapping("/categories")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Object> getCategoriesForFilters() {
        return ResponseEntity.ok(reportService.getCategoriesForFilters());
    }

    @GetMapping("/user-types")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Object> getUserTypesForFilters() {
        return ResponseEntity.ok(reportService.getUserTypesForFilters());
    }

    @GetMapping("/locations")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Object> getLocationsForFilters() {
        return ResponseEntity.ok(reportService.getLocationsForFilters());
    }

    @GetMapping("/export")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Object> exportFilteredAds(
            AdvancedFilterDto filters,
            @RequestParam(defaultValue = "csv") String format) {
        return ResponseEntity.ok(reportService.exportFilteredAds(filters, format));
    }

    @GetMapping("/users/registrations")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Object> getUserRegistrationReport(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(defaultValue = "daily") String period) {
        return ResponseEntity.ok(reportService.getUserRegistrationReport(startDate, endDate, period));
    }

    @GetMapping("/users/active-vs-inactive")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Object> getActiveVsInactiveUsersReport() {
        return ResponseEntity.ok(reportService.getActiveVsInactiveUsersReport());
    }

    @GetMapping("/users/login-activity")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Object> getUserLoginActivityReport(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(defaultValue = "daily") String period) {
        return ResponseEntity.ok(reportService.getUserLoginActivityReport(startDate, endDate, period));
    }

    @GetMapping("/users/views-by-category")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Object> getUserViewsByCategoryReport() {
        return ResponseEntity.ok(reportService.getUserViewsByCategoryReport());
    }

    @GetMapping("/admin/activity")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Object> getAdminActivityReport(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(defaultValue = "daily") String period,
            @RequestParam(required = false) String adminId) {
        return ResponseEntity.ok(reportService.getAdminActivityReport(startDate, endDate, period, adminId));
    }

    @GetMapping("/admin/user-wise-activity")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Object> getAdminUserWiseActivityReport(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        return ResponseEntity.ok(reportService.getAdminUserWiseActivityReport(startDate, endDate));
    }

    @GetMapping("/admin/activity-by-category")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Object> getAdminActivityByCategoryReport(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        return ResponseEntity.ok(reportService.getAdminActivityByCategoryReport(startDate, endDate));
    }

    @GetMapping("/listings/analytics")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Object> getListingAnalyticsReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return ResponseEntity.ok(reportService.getListingAnalyticsReport(startDate, endDate));
    }

    @GetMapping("/listings/active-by-category")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Object> getActiveListingsByCategory() {
        return ResponseEntity.ok(reportService.getActiveListingsByCategory());
    }

    @GetMapping("/listings/approval-times")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Object> getApprovalTimeReport() {
        return ResponseEntity.ok(reportService.getApprovalTimeReport());
    }

    @GetMapping("/listings/by-user")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Object> getListingsByUserReport() {
        return ResponseEntity.ok(reportService.getListingsByUserReport());
    }

    @GetMapping("/payments/transactions")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Object> getPaymentTransactionReport(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(defaultValue = "daily") String period) {
        return ResponseEntity.ok(reportService.getPaymentTransactionReport(startDate, endDate, period));
    }

    @GetMapping("/payments/revenue-by-product")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Object> getRevenueByProduct() {
        return ResponseEntity.ok(reportService.getRevenueByProduct());
    }

    @GetMapping("/payments/revenue-by-category")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR','REVIEWER')")
    public ResponseEntity<Object> getRevenueByCategoryReport() {
        return ResponseEntity.ok(reportService.getRevenueByCategoryReport());
    }
}
