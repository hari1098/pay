package com.paisaads.service;

import com.paisaads.dto.PosterAdDto;
import com.paisaads.entity.*;
import com.paisaads.enums.AdStatus;
import com.paisaads.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PosterAdService {

    private final PosterAdRepository posterAdRepository;
    private final MainCategoryRepository mainCategoryRepository;
    private final CategoryOneRepository categoryOneRepository;
    private final CategoryTwoRepository categoryTwoRepository;
    private final CategoryThreeRepository categoryThreeRepository;
    private final CustomerRepository customerRepository;

    public PosterAdService(PosterAdRepository posterAdRepository,
                            MainCategoryRepository mainCategoryRepository,
                            CategoryOneRepository categoryOneRepository,
                            CategoryTwoRepository categoryTwoRepository,
                            CategoryThreeRepository categoryThreeRepository,
                            CustomerRepository customerRepository) {
        this.posterAdRepository = posterAdRepository;
        this.mainCategoryRepository = mainCategoryRepository;
        this.categoryOneRepository = categoryOneRepository;
        this.categoryTwoRepository = categoryTwoRepository;
        this.categoryThreeRepository = categoryThreeRepository;
        this.customerRepository = customerRepository;
    }

    public List<PosterAdDto> getTodayAds() {
        return posterAdRepository.findPublishedAds().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<PosterAdDto> getMyAds(UUID customerId) {
        return posterAdRepository.findByCustomerIdAndIsActiveTrue(customerId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<PosterAdDto> getAdsByStatus(AdStatus status) {
        return posterAdRepository.findByStatusAndIsActiveTrue(status).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public PosterAdDto getAdById(UUID id) {
        PosterAd ad = posterAdRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Poster ad not found"));
        return toDto(ad);
    }

    @Transactional
    public PosterAdDto createAd(PosterAdDto dto, UUID customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        PosterAd ad = new PosterAd();
        ad.setDates(dto.getDates());
        ad.setState(dto.getState());
        ad.setSid(dto.getSid());
        ad.setCity(dto.getCity());
        ad.setCid(dto.getCid());
        ad.setPostedBy(dto.getPostedBy());
        ad.setStatus(AdStatus.FOR_REVIEW);
        ad.setIsActive(true);
        ad.setPageType(dto.getPageType());
        ad.setCustomer(customer);

        if (dto.getMainCategoryId() != null) {
            ad.setMainCategory(mainCategoryRepository.findById(dto.getMainCategoryId()).orElse(null));
        }
        if (dto.getCategoryOneId() != null) {
            ad.setCategoryOne(categoryOneRepository.findById(dto.getCategoryOneId()).orElse(null));
        }
        if (dto.getCategoryTwoId() != null) {
            ad.setCategoryTwo(categoryTwoRepository.findById(dto.getCategoryTwoId()).orElse(null));
        }
        if (dto.getCategoryThreeId() != null) {
            ad.setCategoryThree(categoryThreeRepository.findById(dto.getCategoryThreeId()).orElse(null));
        }

        ad = posterAdRepository.save(ad);
        return toDto(ad);
    }

    @Transactional
    public PosterAdDto approveAd(UUID id) {
        PosterAd ad = posterAdRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Poster ad not found"));
        ad.setStatus(AdStatus.PUBLISHED);
        ad = posterAdRepository.save(ad);
        return toDto(ad);
    }

    @Transactional
    public PosterAdDto rejectAd(UUID id) {
        PosterAd ad = posterAdRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Poster ad not found"));
        ad.setStatus(AdStatus.REJECTED);
        ad = posterAdRepository.save(ad);
        return toDto(ad);
    }

    private PosterAdDto toDto(PosterAd ad) {
        PosterAdDto dto = new PosterAdDto();
        dto.setId(ad.getId());
        dto.setSequenceNumber(ad.getSequenceNumber());
        dto.setOrderId(ad.getOrderId());
        dto.setStatus(ad.getStatus());
        dto.setIsActive(ad.getIsActive());
        dto.setDates(ad.getDates());
        dto.setState(ad.getState());
        dto.setSid(ad.getSid());
        dto.setCity(ad.getCity());
        dto.setCid(ad.getCid());
        dto.setPostedBy(ad.getPostedBy());
        dto.setPageType(ad.getPageType());
        dto.setCreatedAt(ad.getCreatedAt());
        dto.setUpdatedAt(ad.getUpdatedAt());

        if (ad.getMainCategory() != null) {
            dto.setMainCategoryId(ad.getMainCategory().getId());
            dto.setMainCategoryName(ad.getMainCategory().getName());
        }
        if (ad.getCategoryOne() != null) {
            dto.setCategoryOneId(ad.getCategoryOne().getId());
            dto.setCategoryOneName(ad.getCategoryOne().getName());
        }
        if (ad.getCategoryTwo() != null) {
            dto.setCategoryTwoId(ad.getCategoryTwo().getId());
            dto.setCategoryTwoName(ad.getCategoryTwo().getName());
        }
        if (ad.getCategoryThree() != null) {
            dto.setCategoryThreeId(ad.getCategoryThree().getId());
            dto.setCategoryThreeName(ad.getCategoryThree().getName());
        }
        if (ad.getImage() != null) {
            dto.setImageId(ad.getImage().getId());
            dto.setImageFilePath(ad.getImage().getFilePath());
        }
        if (ad.getCustomer() != null) {
            dto.setCustomerId(ad.getCustomer().getId());
            if (ad.getCustomer().getUser() != null) {
                dto.setCustomerName(ad.getCustomer().getUser().getName());
            }
        }

        return dto;
    }
}
