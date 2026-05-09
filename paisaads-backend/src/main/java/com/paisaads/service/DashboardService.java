package com.paisaads.service;

import com.paisaads.dto.DashboardStats;
import com.paisaads.entity.AdStatus;
import com.paisaads.entity.Customer;
import com.paisaads.repository.CustomerRepository;
import com.paisaads.repository.LineAdRepository;
import com.paisaads.repository.PosterAdRepository;
import com.paisaads.repository.VideoAdRepository;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final LineAdRepository lineAdRepository;
    private final PosterAdRepository posterAdRepository;
    private final VideoAdRepository videoAdRepository;
    private final CustomerRepository customerRepository;

    private static final List<AdStatus> ACTIVE_STATUSES = Arrays.asList(
            AdStatus.PUBLISHED, AdStatus.FOR_REVIEW
    );

    private static final List<AdStatus> PENDING_STATUSES = Arrays.asList(
            AdStatus.PENDING, AdStatus.DRAFT, AdStatus.FOR_REVIEW
    );

    public DashboardStats getUserDashboard(UUID userId) {
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));

        UUID customerId = customer.getId();

        long totalLineAds = lineAdRepository.findByCustomerId(customerId, org.springframework.data.domain.Sort.unsorted()).size();
        long totalPosterAds = posterAdRepository.findByCustomerId(customerId, org.springframework.data.domain.Sort.unsorted()).size();
        long totalVideoAds = videoAdRepository.findByCustomerId(customerId, org.springframework.data.domain.Sort.unsorted()).size();
        long totalAds = totalLineAds + totalPosterAds + totalVideoAds;

        long activeLineAds = lineAdRepository.findByCustomerId(customerId, org.springframework.data.domain.Sort.unsorted())
                .stream().filter(ad -> ACTIVE_STATUSES.contains(ad.getStatus())).count();
        long activePosterAds = posterAdRepository.findByCustomerId(customerId, org.springframework.data.domain.Sort.unsorted())
                .stream().filter(ad -> ACTIVE_STATUSES.contains(ad.getStatus())).count();
        long activeVideoAds = videoAdRepository.findByCustomerId(customerId, org.springframework.data.domain.Sort.unsorted())
                .stream().filter(ad -> ACTIVE_STATUSES.contains(ad.getStatus())).count();
        long activeAds = activeLineAds + activePosterAds + activeVideoAds;

        long pendingLineAds = lineAdRepository.findByCustomerId(customerId, org.springframework.data.domain.Sort.unsorted())
                .stream().filter(ad -> PENDING_STATUSES.contains(ad.getStatus())).count();
        long pendingPosterAds = posterAdRepository.findByCustomerId(customerId, org.springframework.data.domain.Sort.unsorted())
                .stream().filter(ad -> PENDING_STATUSES.contains(ad.getStatus())).count();
        long pendingVideoAds = videoAdRepository.findByCustomerId(customerId, org.springframework.data.domain.Sort.unsorted())
                .stream().filter(ad -> PENDING_STATUSES.contains(ad.getStatus())).count();
        long pendingAds = pendingLineAds + pendingPosterAds + pendingVideoAds;

        return new DashboardStats(totalAds, activeAds, pendingAds, 0L);
    }

    public DashboardStats getGlobalDashboard() {
        long totalLineAds = lineAdRepository.count();
        long totalPosterAds = posterAdRepository.count();
        long totalVideoAds = videoAdRepository.count();
        long totalAds = totalLineAds + totalPosterAds + totalVideoAds;

        long activeLineAds = lineAdRepository.findByIsActiveTrueAndStatusIn(
                ACTIVE_STATUSES, org.springframework.data.domain.Sort.unsorted()).size();
        long activePosterAds = posterAdRepository.findByIsActiveTrueAndStatusIn(
                ACTIVE_STATUSES, org.springframework.data.domain.Sort.unsorted()).size();
        long activeVideoAds = videoAdRepository.findByIsActiveTrueAndStatusIn(
                ACTIVE_STATUSES, org.springframework.data.domain.Sort.unsorted()).size();
        long activeAds = activeLineAds + activePosterAds + activeVideoAds;

        long pendingLineAds = lineAdRepository.findByStatus(AdStatus.PENDING).size()
                + lineAdRepository.findByStatus(AdStatus.DRAFT).size();
        long pendingPosterAds = posterAdRepository.findByStatus(AdStatus.PENDING).size()
                + posterAdRepository.findByStatus(AdStatus.DRAFT).size();
        long pendingVideoAds = videoAdRepository.findByStatus(AdStatus.PENDING).size()
                + videoAdRepository.findByStatus(AdStatus.DRAFT).size();
        long pendingAds = pendingLineAds + pendingPosterAds + pendingVideoAds;

        return new DashboardStats(totalAds, activeAds, pendingAds, 0L);
    }
}
