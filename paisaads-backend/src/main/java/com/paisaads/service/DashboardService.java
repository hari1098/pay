package com.paisaads.service;

import com.paisaads.enums.AdStatus;
import com.paisaads.repository.*;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class DashboardService {

    private final LineAdRepository lineAdRepository;
    private final PosterAdRepository posterAdRepository;
    private final VideoAdRepository videoAdRepository;
    private final UserRepository userRepository;

    public DashboardService(LineAdRepository lineAdRepository,
                            PosterAdRepository posterAdRepository,
                            VideoAdRepository videoAdRepository,
                            UserRepository userRepository) {
        this.lineAdRepository = lineAdRepository;
        this.posterAdRepository = posterAdRepository;
        this.videoAdRepository = videoAdRepository;
        this.userRepository = userRepository;
    }

    public Map<String, Object> getUserDashboard(UUID customerId) {
        Map<String, Object> stats = new HashMap<>();

        long totalLineAds = lineAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.PUBLISHED)
                + lineAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.FOR_REVIEW)
                + lineAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.DRAFT)
                + lineAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.REJECTED)
                + lineAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.ON_HOLD);

        long activeLineAds = lineAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.PUBLISHED);
        long draftLineAds = lineAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.DRAFT);
        long reviewLineAds = lineAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.FOR_REVIEW);
        long rejectedLineAds = lineAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.REJECTED);
        long onHoldLineAds = lineAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.ON_HOLD);

        long totalPosterAds = posterAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.PUBLISHED)
                + posterAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.FOR_REVIEW)
                + posterAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.DRAFT)
                + posterAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.REJECTED)
                + posterAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.ON_HOLD);

        long activePosterAds = posterAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.PUBLISHED);

        long totalVideoAds = videoAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.PUBLISHED)
                + videoAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.FOR_REVIEW)
                + videoAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.DRAFT)
                + videoAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.REJECTED)
                + videoAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.ON_HOLD);

        long activeVideoAds = videoAdRepository.countByCustomerIdAndStatus(customerId, AdStatus.PUBLISHED);

        stats.put("totalAds", totalLineAds + totalPosterAds + totalVideoAds);
        stats.put("activeAds", activeLineAds + activePosterAds + activeVideoAds);
        stats.put("draftAds", draftLineAds);
        stats.put("reviewAds", reviewLineAds);
        stats.put("rejectedAds", rejectedLineAds);
        stats.put("onHoldAds", onHoldLineAds);
        stats.put("lineAds", totalLineAds);
        stats.put("posterAds", totalPosterAds);
        stats.put("videoAds", totalVideoAds);

        return stats;
    }

    public Map<String, Object> getGlobalDashboard() {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.count();
        long totalLineAds = lineAdRepository.count();
        long totalPosterAds = posterAdRepository.count();
        long totalVideoAds = videoAdRepository.count();

        long publishedLineAds = lineAdRepository.countByStatus(AdStatus.PUBLISHED);
        long publishedPosterAds = posterAdRepository.countByStatus(AdStatus.PUBLISHED);
        long publishedVideoAds = videoAdRepository.countByStatus(AdStatus.PUBLISHED);

        long reviewLineAds = lineAdRepository.countByStatus(AdStatus.FOR_REVIEW);
        long reviewPosterAds = posterAdRepository.countByStatus(AdStatus.FOR_REVIEW);
        long reviewVideoAds = videoAdRepository.countByStatus(AdStatus.FOR_REVIEW);

        long rejectedLineAds = lineAdRepository.countByStatus(AdStatus.REJECTED);
        long rejectedPosterAds = posterAdRepository.countByStatus(AdStatus.REJECTED);
        long rejectedVideoAds = videoAdRepository.countByStatus(AdStatus.REJECTED);

        stats.put("totalUsers", totalUsers);
        stats.put("totalAds", totalLineAds + totalPosterAds + totalVideoAds);
        stats.put("publishedAds", publishedLineAds + publishedPosterAds + publishedVideoAds);
        stats.put("reviewAds", reviewLineAds + reviewPosterAds + reviewVideoAds);
        stats.put("rejectedAds", rejectedLineAds + rejectedPosterAds + rejectedVideoAds);
        stats.put("lineAds", totalLineAds);
        stats.put("posterAds", totalPosterAds);
        stats.put("videoAds", totalVideoAds);

        return stats;
    }
}
