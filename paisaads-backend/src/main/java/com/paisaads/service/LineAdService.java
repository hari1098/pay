package com.paisaads.service;

import com.paisaads.dto.LineAdDto;
import com.paisaads.entity.*;
import com.paisaads.enums.AdStatus;
import com.paisaads.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LineAdService {

    private final LineAdRepository lineAdRepository;
    private final MainCategoryRepository mainCategoryRepository;
    private final CategoryOneRepository categoryOneRepository;
    private final CategoryTwoRepository categoryTwoRepository;
    private final CategoryThreeRepository categoryThreeRepository;
    private final CustomerRepository customerRepository;

    public LineAdService(LineAdRepository lineAdRepository,
                         MainCategoryRepository mainCategoryRepository,
                         CategoryOneRepository categoryOneRepository,
                         CategoryTwoRepository categoryTwoRepository,
                         CategoryThreeRepository categoryThreeRepository,
                         CustomerRepository customerRepository) {
        this.lineAdRepository = lineAdRepository;
        this.mainCategoryRepository = mainCategoryRepository;
        this.categoryOneRepository = categoryOneRepository;
        this.categoryTwoRepository = categoryTwoRepository;
        this.categoryThreeRepository = categoryThreeRepository;
        this.customerRepository = customerRepository;
    }

    public List<LineAdDto> getTodayAds() {
        return lineAdRepository.findPublishedAds().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<LineAdDto> getMyAds(UUID customerId) {
        return lineAdRepository.findByCustomerIdAndIsActiveTrue(customerId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<LineAdDto> getAdsByStatus(AdStatus status) {
        return lineAdRepository.findByStatusAndIsActiveTrue(status).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public LineAdDto getAdById(UUID id) {
        LineAd ad = lineAdRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Line ad not found"));
        return toDto(ad);
    }

    @Transactional
    public LineAdDto createAd(LineAdDto dto, UUID customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        LineAd ad = new LineAd();
        ad.setContent(dto.getContent());
        ad.setState(dto.getState());
        ad.setSid(dto.getSid());
        ad.setCity(dto.getCity());
        ad.setCid(dto.getCid());
        ad.setDates(dto.getDates());
        ad.setPostedBy(dto.getPostedBy());
        ad.setContactOne(dto.getContactOne());
        ad.setContactTwo(dto.getContactTwo());
        ad.setBackgroundColor(dto.getBackgroundColor());
        ad.setTextColor(dto.getTextColor());
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

        ad = lineAdRepository.save(ad);
        return toDto(ad);
    }

    @Transactional
    public LineAdDto approveAd(UUID id) {
        LineAd ad = lineAdRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Line ad not found"));
        ad.setStatus(AdStatus.PUBLISHED);
        ad = lineAdRepository.save(ad);
        return toDto(ad);
    }

    @Transactional
    public LineAdDto rejectAd(UUID id) {
        LineAd ad = lineAdRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Line ad not found"));
        ad.setStatus(AdStatus.REJECTED);
        ad = lineAdRepository.save(ad);
        return toDto(ad);
    }

    private LineAdDto toDto(LineAd ad) {
        LineAdDto dto = new LineAdDto();
        dto.setId(ad.getId());
        dto.setSequenceNumber(ad.getSequenceNumber());
        dto.setOrderId(ad.getOrderId());
        dto.setContent(ad.getContent());
        dto.setState(ad.getState());
        dto.setSid(ad.getSid());
        dto.setCity(ad.getCity());
        dto.setCid(ad.getCid());
        dto.setDates(ad.getDates());
        dto.setPostedBy(ad.getPostedBy());
        dto.setContactOne(ad.getContactOne());
        dto.setContactTwo(ad.getContactTwo());
        dto.setBackgroundColor(ad.getBackgroundColor());
        dto.setTextColor(ad.getTextColor());
        dto.setStatus(ad.getStatus());
        dto.setIsActive(ad.getIsActive());
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
        if (ad.getCustomer() != null) {
            dto.setCustomerId(ad.getCustomer().getId());
            if (ad.getCustomer().getUser() != null) {
                dto.setCustomerName(ad.getCustomer().getUser().getName());
            }
        }

        return dto;
    }
}
