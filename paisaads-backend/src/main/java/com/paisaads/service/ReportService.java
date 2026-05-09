package com.paisaads.service;

import com.paisaads.dto.AdvancedFilterDto;
import com.paisaads.entity.*;
import com.paisaads.enums.AdStatus;
import com.paisaads.enums.AdType;
import com.paisaads.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final LineAdService lineAdService;
    private final PosterAdService posterAdService;
    private final VideoAdService videoAdService;
    private final LineAdRepository lineAdRepository;
    private final PosterAdRepository posterAdRepository;
    private final VideoAdRepository videoAdRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final MainCategoryRepository mainCategoryRepository;

    public Object getLineAdStats() {
        return lineAdService.getLineAdStats();
    }

    public Object getLineAdsByStatusAndTimeFrame(AdStatus status, String startDate, String endDate, int page, int limit) {
        List<LineAd> ads = lineAdRepository.findAllActive().stream()
            .filter(ad -> ad.getStatus() == status)
            .collect(Collectors.toList());

        if (startDate != null && endDate != null) {
            LocalDateTime start = LocalDateTime.parse(startDate + "T00:00:00");
            LocalDateTime end = LocalDateTime.parse(endDate + "T23:59:59");
            ads = ads.stream()
                .filter(ad -> ad.getCreatedAt() != null && ad.getCreatedAt().isAfter(start) && ad.getCreatedAt().isBefore(end))
                .collect(Collectors.toList());
        }

        int total = ads.size();
        int totalPages = (int) Math.ceil((double) total / limit);
        int skip = (page - 1) * limit;
        List<LineAd> paginated = ads.subList(Math.min(skip, total), Math.min(skip + limit, total));

        return Map.of("data", paginated, "totalCount", total, "page", page, "limit", limit,
            "totalPages", totalPages, "hasNext", page < totalPages, "hasPrevious", page > 1);
    }

    public Object getAdStats(AdType type, AdStatus status, int page, int limit) {
        List<?> ads;
        if (type == AdType.LINE) ads = lineAdRepository.findAllActive().stream().filter(a -> a.getStatus() == status).collect(Collectors.toList());
        else if (type == AdType.POSTER) ads = posterAdRepository.findAllActive().stream().filter(a -> a.getStatus() == status).collect(Collectors.toList());
        else ads = videoAdRepository.findAllActive().stream().filter(a -> a.getStatus() == status).collect(Collectors.toList());

        int total = ads.size();
        int totalPages = (int) Math.ceil((double) total / limit);
        int skip = (page - 1) * limit;
        List<?> paginated = ads.subList(Math.min(skip, total), Math.min(skip + limit, total));

        return Map.of("data", paginated, "totalCount", total, "page", page, "limit", limit,
            "totalPages", totalPages, "status", status.name(), "type", type.name());
    }

    public Object getFilteredAds(AdvancedFilterDto filters) {
        List<Object> allAds = new ArrayList<>();
        if (filters.getAdType() == null || filters.getAdType().equals("LINE") || (filters.getAdTypes() != null && filters.getAdTypes().contains("LINE"))) {
            allAds.addAll(lineAdService.findAll(filters.getCategoryId(), filters.getStateId(), filters.getCityId()));
        }
        if (filters.getAdType() == null || filters.getAdType().equals("POSTER") || (filters.getAdTypes() != null && filters.getAdTypes().contains("POSTER"))) {
            allAds.addAll(posterAdService.findAll(filters.getCategoryId(), filters.getStateId(), filters.getCityId()));
        }
        if (filters.getAdType() == null || filters.getAdType().equals("VIDEO") || (filters.getAdTypes() != null && filters.getAdTypes().contains("VIDEO"))) {
            allAds.addAll(videoAdService.findAll(filters.getCategoryId(), filters.getStateId(), filters.getCityId()));
        }

        int total = allAds.size();
        int page = filters.getPage() != null ? filters.getPage() : 1;
        int limitVal = filters.getLimit() != null ? filters.getLimit() : 10;
        int totalPages = (int) Math.ceil((double) total / limitVal);
        int skip = (page - 1) * limitVal;
        List<Object> paginated = allAds.subList(Math.min(skip, total), Math.min(skip + limitVal, total));

        return Map.of("data", paginated, "totalCount", total, "page", page, "limit", limitVal,
            "totalPages", totalPages, "hasNext", page < totalPages, "hasPrevious", page > 1);
    }

    public Object getFilteredAdStats(AdvancedFilterDto filters) {
        Map<String, Long> statusCounts = new LinkedHashMap<>();
        for (AdStatus s : AdStatus.values()) {
            statusCounts.put(s.name(), 0L);
        }
        Map<String, Long> typeCounts = Map.of("LINE", (long) lineAdService.findAll(filters.getCategoryId(), filters.getStateId(), filters.getCityId()).size(),
            "POSTER", (long) posterAdService.findAll(filters.getCategoryId(), filters.getStateId(), filters.getCityId()).size(),
            "VIDEO", (long) videoAdService.findAll(filters.getCategoryId(), filters.getStateId(), filters.getCityId()).size());

        return Map.of("statusCounts", statusCounts, "typeCounts", typeCounts);
    }

    public Object getCategoriesForFilters() {
        return mainCategoryRepository.findAll();
    }

    public Object getUserTypesForFilters() {
        Set<String> types = new HashSet<>();
        lineAdRepository.findAllActive().forEach(ad -> { if (ad.getPostedBy() != null) types.add(ad.getPostedBy()); });
        posterAdRepository.findAllActive().forEach(ad -> { if (ad.getPostedBy() != null) types.add(ad.getPostedBy()); });
        videoAdRepository.findAllActive().forEach(ad -> { if (ad.getPostedBy() != null) types.add(ad.getPostedBy()); });
        return Map.of("userTypes", new ArrayList<>(types));
    }

    public Object getLocationsForFilters() {
        Set<String> states = new HashSet<>();
        Set<String> cities = new HashSet<>();
        lineAdRepository.findAllActive().forEach(ad -> { if (ad.getState() != null) states.add(ad.getState()); if (ad.getCity() != null) cities.add(ad.getCity()); });
        posterAdRepository.findAllActive().forEach(ad -> { if (ad.getState() != null) states.add(ad.getState()); if (ad.getCity() != null) cities.add(ad.getCity()); });
        videoAdRepository.findAllActive().forEach(ad -> { if (ad.getState() != null) states.add(ad.getState()); if (ad.getCity() != null) cities.add(ad.getCity()); });
        return Map.of("states", new ArrayList<>(states), "cities", new ArrayList<>(cities));
    }

    public Object exportFilteredAds(AdvancedFilterDto filters, String format) {
        List<Object> allAds = new ArrayList<>();
        allAds.addAll(lineAdService.findAll(filters.getCategoryId(), filters.getStateId(), filters.getCityId()));
        allAds.addAll(posterAdService.findAll(filters.getCategoryId(), filters.getStateId(), filters.getCityId()));
        allAds.addAll(videoAdService.findAll(filters.getCategoryId(), filters.getStateId(), filters.getCityId()));
        return Map.of("data", allAds, "format", format, "totalCount", allAds.size());
    }

    public Object getUserRegistrationReport(String startDate, String endDate, String period) {
        long total = userRepository.count();
        return Map.of("totalRegistrations", total, "period", period, "startDate", startDate, "endDate", endDate);
    }

    public Object getActiveVsInactiveUsersReport() {
        long total = userRepository.count();
        long active = userRepository.findAll().stream().filter(u -> u.getIsActive() != null && u.getIsActive()).count();
        long inactive = total - active;
        double activePercent = total > 0 ? (double) active / total * 100 : 0;
        double inactivePercent = total > 0 ? (double) inactive / total * 100 : 0;
        return Map.of("active", active, "inactive", inactive, "activePercent", activePercent,
            "inactivePercent", inactivePercent, "total", total);
    }

    public Object getUserLoginActivityReport(String startDate, String endDate, String period) {
        return Map.of("period", period, "startDate", startDate, "endDate", endDate,
            "message", "Login activity tracking is not available in this version");
    }

    public Object getUserViewsByCategoryReport() {
        return Map.of("message", "View tracking is not available in this version");
    }

    public Object getAdminActivityReport(String startDate, String endDate, String period, String adminId) {
        return Map.of("period", period, "startDate", startDate, "endDate", endDate,
            "adminId", adminId != null ? adminId : "all",
            "message", "Admin activity report generated");
    }

    public Object getAdminUserWiseActivityReport(String startDate, String endDate) {
        List<Map<String, Object>> result = new ArrayList<>();
        userRepository.findAll().forEach(user -> {
            if (user.getRole() == com.paisaads.enums.Role.SUPER_ADMIN
                || user.getRole() == com.paisaads.enums.Role.EDITOR
                || user.getRole() == com.paisaads.enums.Role.REVIEWER) {
                Map<String, Object> map = new HashMap<>();
                map.put("userId", user.getId().toString());
                map.put("userName", user.getName());
                map.put("role", user.getRole().name());
                result.add(map);
            }
        });
        return Map.of("data", result, "startDate", startDate, "endDate", endDate);
    }

    public Object getAdminActivityByCategoryReport(String startDate, String endDate) {
        Map<String, Object> result = new HashMap<>();
        for (AdStatus s : AdStatus.values()) {
            result.put(s.name() + "LineAds", lineAdRepository.findAllActive().stream()
                .filter(a -> a.getStatus() == s).count());
            result.put(s.name() + "PosterAds", posterAdRepository.findAllActive().stream()
                .filter(a -> a.getStatus() == s).count());
            result.put(s.name() + "VideoAds", videoAdRepository.findAllActive().stream()
                .filter(a -> a.getStatus() == s).count());
        }
        result.put("startDate", startDate);
        result.put("endDate", endDate);
        return result;
    }

    public Object getListingAnalyticsReport(String startDate, String endDate) {
        long totalLineAds = lineAdRepository.findAllActive().size();
        long totalPosterAds = posterAdRepository.findAllActive().size();
        long totalVideoAds = videoAdRepository.findAllActive().size();

        return Map.of(
            "totalLineAds", totalLineAds,
            "totalPosterAds", totalPosterAds,
            "totalVideoAds", totalVideoAds,
            "totalListings", totalLineAds + totalPosterAds + totalVideoAds,
            "startDate", startDate != null ? startDate : "all",
            "endDate", endDate != null ? endDate : "all"
        );
    }

    public Object getActiveListingsByCategory() {
        Map<String, Long> result = new HashMap<>();
        lineAdRepository.findAllActive().stream()
            .filter(ad -> ad.getStatus() == AdStatus.PUBLISHED)
            .forEach(ad -> result.merge(ad.getMainCategory().getName(), 1L, Long::sum));
        posterAdRepository.findAllActive().stream()
            .filter(ad -> ad.getStatus() == AdStatus.PUBLISHED)
            .forEach(ad -> result.merge(ad.getMainCategory().getName(), 1L, Long::sum));
        videoAdRepository.findAllActive().stream()
            .filter(ad -> ad.getStatus() == AdStatus.PUBLISHED)
            .forEach(ad -> result.merge(ad.getMainCategory().getName(), 1L, Long::sum));
        return Map.of("categories", result);
    }

    public Object getApprovalTimeReport() {
        return Map.of("message", "Approval time analytics is not available in this version");
    }

    public Object getListingsByUserReport() {
        Map<String, Map<String, Long>> result = new HashMap<>();
        lineAdRepository.findAllActive().forEach(ad -> {
            String key = ad.getCustomer() != null && ad.getCustomer().getUser() != null
                ? ad.getCustomer().getUser().getName() : "unknown";
            result.computeIfAbsent(key, k -> new HashMap<>()).merge("lineAds", 1L, Long::sum);
        });
        posterAdRepository.findAllActive().forEach(ad -> {
            String key = ad.getCustomer() != null && ad.getCustomer().getUser() != null
                ? ad.getCustomer().getUser().getName() : "unknown";
            result.computeIfAbsent(key, k -> new HashMap<>()).merge("posterAds", 1L, Long::sum);
        });
        videoAdRepository.findAllActive().forEach(ad -> {
            String key = ad.getCustomer() != null && ad.getCustomer().getUser() != null
                ? ad.getCustomer().getUser().getName() : "unknown";
            result.computeIfAbsent(key, k -> new HashMap<>()).merge("videoAds", 1L, Long::sum);
        });
        return Map.of("data", result);
    }

    public Object getPaymentTransactionReport(String startDate, String endDate, String period) {
        List<Payment> payments = paymentRepository.findAll();
        BigDecimal totalRevenue = payments.stream()
            .map(Payment::getAmount)
            .filter(Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        return Map.of("totalPayments", payments.size(), "totalRevenue", totalRevenue,
            "period", period, "startDate", startDate, "endDate", endDate, "payments", payments);
    }

    public Object getRevenueByProduct() {
        List<Payment> payments = paymentRepository.findAll();

        BigDecimal lineAdRevenue = BigDecimal.ZERO;
        BigDecimal posterAdRevenue = BigDecimal.ZERO;
        BigDecimal videoAdRevenue = BigDecimal.ZERO;

        for (Payment p : payments) {
            if (p.getLineAd() != null && p.getAmount() != null) lineAdRevenue = lineAdRevenue.add(p.getAmount());
            else if (p.getPosterAd() != null && p.getAmount() != null) posterAdRevenue = posterAdRevenue.add(p.getAmount());
            else if (p.getVideoAd() != null && p.getAmount() != null) videoAdRevenue = videoAdRevenue.add(p.getAmount());
        }

        return Map.of("lineAdRevenue", lineAdRevenue, "posterAdRevenue", posterAdRevenue,
            "videoAdRevenue", videoAdRevenue, "totalRevenue", lineAdRevenue.add(posterAdRevenue).add(videoAdRevenue));
    }

    public Object getRevenueByCategoryReport() {
        Map<String, BigDecimal> categoryRevenue = new HashMap<>();
        List<Payment> payments = paymentRepository.findAll();

        for (Payment p : payments) {
            String catName = "Other";
            if (p.getLineAd() != null && p.getLineAd().getMainCategory() != null) catName = p.getLineAd().getMainCategory().getName();
            else if (p.getPosterAd() != null && p.getPosterAd().getMainCategory() != null) catName = p.getPosterAd().getMainCategory().getName();
            else if (p.getVideoAd() != null && p.getVideoAd().getMainCategory() != null) catName = p.getVideoAd().getMainCategory().getName();

            if (p.getAmount() != null) categoryRevenue.merge(catName, p.getAmount(), BigDecimal::add);
        }

        return Map.of("categories", categoryRevenue);
    }
}
