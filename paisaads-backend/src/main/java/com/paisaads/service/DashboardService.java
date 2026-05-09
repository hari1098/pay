package com.paisaads.service;

import com.paisaads.entity.*;
import com.paisaads.enums.AdStatus;
import com.paisaads.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final LineAdRepository lineAdRepository;
    private final PosterAdRepository posterAdRepository;
    private final VideoAdRepository videoAdRepository;
    private final UserRepository userRepository;
    private final AdCommentRepository adCommentRepository;

    public Map<String, Object> getUserDashboard(UUID userId) {
        Map<String, Object> dashboard = new HashMap<>();

        List<LineAd> lineAds = lineAdRepository.findAllActive().stream()
            .filter(ad -> ad.getCustomer() != null && ad.getCustomer().getUser() != null
                && ad.getCustomer().getUser().getId().equals(userId))
            .toList();
        List<PosterAd> posterAds = posterAdRepository.findAllActive().stream()
            .filter(ad -> ad.getCustomer() != null && ad.getCustomer().getUser() != null
                && ad.getCustomer().getUser().getId().equals(userId))
            .toList();
        List<VideoAd> videoAds = videoAdRepository.findAllActive().stream()
            .filter(ad -> ad.getCustomer() != null && ad.getCustomer().getUser() != null
                && ad.getCustomer().getUser().getId().equals(userId))
            .toList();

        Map<String, Long> lineAdStatusCounts = new HashMap<>();
        for (AdStatus s : AdStatus.values()) {
            lineAdStatusCounts.put(s.name(), lineAds.stream().filter(a -> a.getStatus() == s).count());
        }
        Map<String, Long> posterAdStatusCounts = new HashMap<>();
        for (AdStatus s : AdStatus.values()) {
            posterAdStatusCounts.put(s.name(), posterAds.stream().filter(a -> a.getStatus() == s).count());
        }
        Map<String, Long> videoAdStatusCounts = new HashMap<>();
        for (AdStatus s : AdStatus.values()) {
            videoAdStatusCounts.put(s.name(), videoAds.stream().filter(a -> a.getStatus() == s).count());
        }

        dashboard.put("lineAds", Map.of("total", lineAds.size(), "statusCounts", lineAdStatusCounts));
        dashboard.put("posterAds", Map.of("total", posterAds.size(), "statusCounts", posterAdStatusCounts));
        dashboard.put("videoAds", Map.of("total", videoAds.size(), "statusCounts", videoAdStatusCounts));
        dashboard.put("totalAds", lineAds.size() + posterAds.size() + videoAds.size());
        return dashboard;
    }

    public Map<String, Object> getGlobalDashboard() {
        Map<String, Object> dashboard = new HashMap<>();

        List<LineAd> lineAds = lineAdRepository.findAllActive();
        List<PosterAd> posterAds = posterAdRepository.findAllActive();
        List<VideoAd> videoAds = videoAdRepository.findAllActive();

        Map<String, Long> lineAdStatusCounts = new HashMap<>();
        for (AdStatus s : AdStatus.values()) {
            lineAdStatusCounts.put(s.name(), lineAds.stream().filter(a -> a.getStatus() == s).count());
        }
        Map<String, Long> posterAdStatusCounts = new HashMap<>();
        for (AdStatus s : AdStatus.values()) {
            posterAdStatusCounts.put(s.name(), posterAds.stream().filter(a -> a.getStatus() == s).count());
        }
        Map<String, Long> videoAdStatusCounts = new HashMap<>();
        for (AdStatus s : AdStatus.values()) {
            videoAdStatusCounts.put(s.name(), videoAds.stream().filter(a -> a.getStatus() == s).count());
        }

        long totalUsers = userRepository.count();

        dashboard.put("lineAds", Map.of("total", lineAds.size(), "statusCounts", lineAdStatusCounts));
        dashboard.put("posterAds", Map.of("total", posterAds.size(), "statusCounts", posterAdStatusCounts));
        dashboard.put("videoAds", Map.of("total", videoAds.size(), "statusCounts", videoAdStatusCounts));
        dashboard.put("totalAds", lineAds.size() + posterAds.size() + videoAds.size());
        dashboard.put("totalUsers", totalUsers);
        return dashboard;
    }
}
