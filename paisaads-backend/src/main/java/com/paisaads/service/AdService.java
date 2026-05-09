package com.paisaads.service;

import com.paisaads.entity.AdStatus;
import com.paisaads.entity.Customer;
import com.paisaads.entity.LineAd;
import com.paisaads.entity.PosterAd;
import com.paisaads.entity.VideoAd;
import com.paisaads.repository.CustomerRepository;
import com.paisaads.repository.LineAdRepository;
import com.paisaads.repository.PosterAdRepository;
import com.paisaads.repository.VideoAdRepository;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdService {

    private final LineAdRepository lineAdRepository;
    private final PosterAdRepository posterAdRepository;
    private final VideoAdRepository videoAdRepository;
    private final CustomerRepository customerRepository;

    private static final List<AdStatus> PUBLISHED_STATUSES = Arrays.asList(
            AdStatus.PUBLISHED, AdStatus.FOR_REVIEW
    );

    public List<LineAd> getLineAdsToday() {
        return lineAdRepository.findByIsActiveTrueAndStatusIn(
                PUBLISHED_STATUSES,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
    }

    public List<PosterAd> getPosterAdsToday() {
        return posterAdRepository.findByIsActiveTrueAndStatusIn(
                PUBLISHED_STATUSES,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
    }

    public List<VideoAd> getVideoAdsToday() {
        return videoAdRepository.findByIsActiveTrueAndStatusIn(
                PUBLISHED_STATUSES,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
    }

    public List<LineAd> getMyLineAds(UUID userId) {
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));
        return lineAdRepository.findByCustomerId(customer.getId(), Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public List<PosterAd> getMyPosterAds(UUID userId) {
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));
        return posterAdRepository.findByCustomerId(customer.getId(), Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public List<VideoAd> getMyVideoAds(UUID userId) {
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));
        return videoAdRepository.findByCustomerId(customer.getId(), Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Transactional
    public LineAd createLineAd(UUID userId, LineAd lineAd) {
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));
        lineAd.setCustomer(customer);
        lineAd.setStatus(AdStatus.DRAFT);
        lineAd.setActive(true);
        return lineAdRepository.save(lineAd);
    }

    @Transactional
    public PosterAd createPosterAd(UUID userId, PosterAd posterAd) {
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));
        posterAd.setCustomer(customer);
        posterAd.setStatus(AdStatus.DRAFT);
        posterAd.setActive(true);
        return posterAdRepository.save(posterAd);
    }

    @Transactional
    public VideoAd createVideoAd(UUID userId, VideoAd videoAd) {
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));
        videoAd.setCustomer(customer);
        videoAd.setStatus(AdStatus.DRAFT);
        videoAd.setActive(true);
        return videoAdRepository.save(videoAd);
    }

    @Transactional
    public LineAd approveLineAd(UUID adId) {
        LineAd ad = lineAdRepository.findById(adId)
                .orElseThrow(() -> new RuntimeException("Line ad not found"));
        ad.setStatus(AdStatus.PUBLISHED);
        return lineAdRepository.save(ad);
    }

    @Transactional
    public LineAd rejectLineAd(UUID adId) {
        LineAd ad = lineAdRepository.findById(adId)
                .orElseThrow(() -> new RuntimeException("Line ad not found"));
        ad.setStatus(AdStatus.REJECTED);
        return lineAdRepository.save(ad);
    }

    @Transactional
    public PosterAd approvePosterAd(UUID adId) {
        PosterAd ad = posterAdRepository.findById(adId)
                .orElseThrow(() -> new RuntimeException("Poster ad not found"));
        ad.setStatus(AdStatus.PUBLISHED);
        return posterAdRepository.save(ad);
    }

    @Transactional
    public PosterAd rejectPosterAd(UUID adId) {
        PosterAd ad = posterAdRepository.findById(adId)
                .orElseThrow(() -> new RuntimeException("Poster ad not found"));
        ad.setStatus(AdStatus.REJECTED);
        return posterAdRepository.save(ad);
    }

    @Transactional
    public VideoAd approveVideoAd(UUID adId) {
        VideoAd ad = videoAdRepository.findById(adId)
                .orElseThrow(() -> new RuntimeException("Video ad not found"));
        ad.setStatus(AdStatus.PUBLISHED);
        return videoAdRepository.save(ad);
    }

    @Transactional
    public VideoAd rejectVideoAd(UUID adId) {
        VideoAd ad = videoAdRepository.findById(adId)
                .orElseThrow(() -> new RuntimeException("Video ad not found"));
        ad.setStatus(AdStatus.REJECTED);
        return videoAdRepository.save(ad);
    }

    public List<LineAd> getLineAdsByStatus(AdStatus status) {
        return lineAdRepository.findByStatus(status);
    }

    public List<PosterAd> getPosterAdsByStatus(AdStatus status) {
        return posterAdRepository.findByStatus(status);
    }

    public List<VideoAd> getVideoAdsByStatus(AdStatus status) {
        return videoAdRepository.findByStatus(status);
    }
}
