package com.paisaads.service;

import com.paisaads.dto.CreateLineAdDto;
import com.paisaads.entity.*;
import com.paisaads.enums.AdStatus;
import com.paisaads.enums.AdType;
import com.paisaads.enums.PageType;
import com.paisaads.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LineAdService {

    private final LineAdRepository lineAdRepository;
    private final CategoryService categoryService;
    private final UserService userService;
    private final AdPositionService adPositionService;
    private final ImageService imageService;

    @Transactional
    public LineAd createAd(UUID userId, CreateLineAdDto dto) {
        User user = userService.findOneById(userId);
        if (user.getCustomer() == null) throw new RuntimeException("User not found");

        AdPosition position = adPositionService.create(AdType.LINE, 
            dto.getPageType() != null ? PageType.valueOf(dto.getPageType()) : PageType.HOME,
            null, 0);

        LineAd ad = new LineAd();
        ad.setPosition(position);
        ad.setCustomer(user.getCustomer());
        ad.setContent(dto.getContent());
        ad.setState(dto.getState());
        ad.setSid(dto.getSid());
        ad.setCity(dto.getCity());
        ad.setCid(dto.getCid());
        ad.setPostedBy(dto.getPostedBy() != null ? dto.getPostedBy() : user.getName());
        ad.setContactOne(dto.getContactOne());
        ad.setContactTwo(dto.getContactTwo());
        ad.setBackgroundColor(dto.getBackgroundColor());
        ad.setTextColor(dto.getTextColor());
        if (dto.getDates() != null) ad.setDatesList(dto.getDates());

        ad.setMainCategory(categoryService.findMainCategoryById(UUID.fromString(dto.getMainCategoryId())));
        if (dto.getCategoryOneId() != null) ad.setCategoryOne(categoryService.findCategoryOneById(UUID.fromString(dto.getCategoryOneId())));
        if (dto.getCategoryTwoId() != null) ad.setCategoryTwo(categoryService.findCategoryTwoById(UUID.fromString(dto.getCategoryTwoId())));
        if (dto.getCategoryThreeId() != null) ad.setCategoryThree(categoryService.findCategoryThreeById(UUID.fromString(dto.getCategoryThreeId())));

        if (dto.getImageIds() != null) {
            List<Image> images = dto.getImageIds().stream()
                .map(id -> imageService.confirmImage(UUID.fromString(id)))
                .collect(Collectors.toList());
            ad.setImages(images);
        }

        return lineAdRepository.save(ad);
    }

    public List<Map<String, Object>> getTodayLineAds(String categoryId, Integer stateId, Integer cityId) {
        String today = java.time.LocalDate.now().toString();
        List<LineAd> ads = lineAdRepository.findAllActive();
        
        return ads.stream()
            .filter(ad -> ad.getStatus() == AdStatus.PUBLISHED && ad.getIsActive())
            .filter(ad -> categoryId == null || ad.getMainCategory().getId().toString().equals(categoryId))
            .filter(ad -> stateId == null || stateId.equals(ad.getSid()))
            .filter(ad -> cityId == null || cityId.equals(ad.getCid()))
            .filter(ad -> ad.getDatesList().stream().anyMatch(d -> d.startsWith(today)))
            .map(ad -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", ad.getId()); map.put("content", ad.getContent());
                map.put("state", ad.getState()); map.put("city", ad.getCity());
                map.put("postedBy", ad.getPostedBy()); map.put("contactOne", ad.getContactOne());
                map.put("contactTwo", ad.getContactTwo()); map.put("backgroundColor", ad.getBackgroundColor());
                map.put("textColor", ad.getTextColor()); map.put("images", ad.getImages());
                map.put("mainCategory", ad.getMainCategory()); map.put("categoryOne", ad.getCategoryOne());
                map.put("categoryTwo", ad.getCategoryTwo()); map.put("categoryThree", ad.getCategoryThree());
                map.put("position", ad.getPosition()); map.put("createdAt", ad.getCreatedAt());
                map.put("updatedAt", ad.getUpdatedAt());
                map.put("customerName", ad.getCustomer() != null && ad.getCustomer().getUser() != null ? ad.getCustomer().getUser().getName() : null);
                map.put("cityId", ad.getCid()); map.put("stateId", ad.getSid());
                return map;
            })
            .collect(Collectors.toList());
    }

    public List<LineAd> findAll(String categoryId, Integer stateId, Integer cityId) {
        List<LineAd> ads = lineAdRepository.findAllActive();
        if (categoryId != null) ads = ads.stream()
            .filter(ad -> ad.getMainCategory().getId().toString().equals(categoryId) ||
                (ad.getCategoryOne() != null && ad.getCategoryOne().getId().toString().equals(categoryId)) ||
                (ad.getCategoryTwo() != null && ad.getCategoryTwo().getId().toString().equals(categoryId)) ||
                (ad.getCategoryThree() != null && ad.getCategoryThree().getId().toString().equals(categoryId)))
            .collect(Collectors.toList());
        if (stateId != null) ads = ads.stream().filter(ad -> stateId.equals(ad.getSid())).collect(Collectors.toList());
        if (cityId != null) ads = ads.stream().filter(ad -> cityId.equals(ad.getCid())).collect(Collectors.toList());
        return ads;
    }

    public List<LineAd> findAllByStatuses(List<AdStatus> statuses) {
        return lineAdRepository.findByStatusInAndIsActiveTrueOrderByCreatedAtDesc(statuses);
    }

    public List<LineAd> findAllByUserId(UUID userId) {
        User user = userService.findOneById(userId);
        if (user.getCustomer() == null) return List.of();
        return lineAdRepository.findByCustomerIdFull(user.getCustomer().getId());
    }

    public List<LineAd> findByCategory(String categoryId) {
        UUID catId = UUID.fromString(categoryId);
        return lineAdRepository.findAllActive().stream()
            .filter(ad -> ad.getMainCategory().getId().equals(catId) ||
                (ad.getCategoryOne() != null && ad.getCategoryOne().getId().equals(catId)) ||
                (ad.getCategoryTwo() != null && ad.getCategoryTwo().getId().equals(catId)) ||
                (ad.getCategoryThree() != null && ad.getCategoryThree().getId().equals(catId)))
            .collect(Collectors.toList());
    }

    public List<LineAd> searchAds(String text, String city, String state, String categoryId, AdStatus status) {
        List<LineAd> ads = lineAdRepository.findAllActive();
        if (text != null) ads = ads.stream().filter(ad -> ad.getContent() != null && ad.getContent().toLowerCase().contains(text.toLowerCase())).collect(Collectors.toList());
        if (city != null) ads = ads.stream().filter(ad -> city.equals(ad.getCity())).collect(Collectors.toList());
        if (state != null) ads = ads.stream().filter(ad -> state.equals(ad.getState())).collect(Collectors.toList());
        if (categoryId != null) ads = findByCategory(categoryId);
        if (status != null) ads = ads.stream().filter(ad -> ad.getStatus() == status).collect(Collectors.toList());
        return ads;
    }

    public LineAd findOne(String id) {
        return lineAdRepository.findById(UUID.fromString(id)).orElseThrow(() -> new RuntimeException("Ad not found"));
    }

    @Transactional
    public LineAd updateAdByUser(UUID userId, String adId, CreateLineAdDto dto) {
        User user = userService.findOneById(userId);
        LineAd ad = findOne(adId);
        if (!ad.getCustomer().getId().equals(user.getCustomer().getId()))
            throw new SecurityException("You can only edit your own ad");
        if (ad.getStatus() == AdStatus.REJECTED) throw new IllegalArgumentException("Rejected ads cannot be edited");
        if (ad.getStatus() != AdStatus.DRAFT && ad.getStatus() != AdStatus.HOLD)
            throw new IllegalArgumentException("Ad can only be edited in DRAFT or HOLD status");

        if (dto.getContent() != null) ad.setContent(dto.getContent());
        if (dto.getState() != null) ad.setState(dto.getState());
        if (dto.getSid() != null) ad.setSid(dto.getSid());
        if (dto.getCity() != null) ad.setCity(dto.getCity());
        if (dto.getCid() != null) ad.setCid(dto.getCid());
        if (dto.getPostedBy() != null) ad.setPostedBy(dto.getPostedBy());
        if (dto.getContactOne() != null) ad.setContactOne(dto.getContactOne());
        if (dto.getContactTwo() != null) ad.setContactTwo(dto.getContactTwo());
        if (dto.getBackgroundColor() != null) ad.setBackgroundColor(dto.getBackgroundColor());
        if (dto.getTextColor() != null) ad.setTextColor(dto.getTextColor());
        if (dto.getDates() != null) ad.setDatesList(dto.getDates());

        return lineAdRepository.save(ad);
    }

    @Transactional
    public LineAd updateAdByAdmin(UUID userId, String adId, CreateLineAdDto dto) {
        LineAd ad = findOne(adId);
        if (ad.getStatus() == AdStatus.REJECTED) throw new IllegalArgumentException("Rejected ads cannot be edited");

        if (dto.getMainCategoryId() != null) ad.setMainCategory(categoryService.findMainCategoryById(UUID.fromString(dto.getMainCategoryId())));
        if (dto.getCategoryOneId() != null) ad.setCategoryOne(categoryService.findCategoryOneById(UUID.fromString(dto.getCategoryOneId())));
        if (dto.getCategoryTwoId() != null) ad.setCategoryTwo(categoryService.findCategoryTwoById(UUID.fromString(dto.getCategoryTwoId())));
        if (dto.getCategoryThreeId() != null) ad.setCategoryThree(categoryService.findCategoryThreeById(UUID.fromString(dto.getCategoryThreeId())));
        if (dto.getContent() != null) ad.setContent(dto.getContent());
        if (dto.getState() != null) ad.setState(dto.getState());
        if (dto.getSid() != null) ad.setSid(dto.getSid());
        if (dto.getCity() != null) ad.setCity(dto.getCity());
        if (dto.getCid() != null) ad.setCid(dto.getCid());
        if (dto.getPostedBy() != null) ad.setPostedBy(dto.getPostedBy());
        if (dto.getContactOne() != null) ad.setContactOne(dto.getContactOne());
        if (dto.getContactTwo() != null) ad.setContactTwo(dto.getContactTwo());
        if (dto.getBackgroundColor() != null) ad.setBackgroundColor(dto.getBackgroundColor());
        if (dto.getTextColor() != null) ad.setTextColor(dto.getTextColor());
        if (dto.getDates() != null) ad.setDatesList(dto.getDates());

        return lineAdRepository.save(ad);
    }

    @Transactional
    public LineAd updateAdStatus(String adId, AdStatus status) {
        LineAd ad = findOne(adId);
        ad.setStatus(status);
        return lineAdRepository.save(ad);
    }

    @Transactional
    public LineAd deleteAd(String adId, UUID userId) {
        LineAd ad = findOne(adId);
        if (ad.getPosition() != null) adPositionService.remove(ad.getPosition().getId());
        ad.setIsActive(false);
        return lineAdRepository.save(ad);
    }

    public Map<String, Object> getLineAdStats() {
        long total = lineAdRepository.findAllActive().size();
        Map<String, Long> statusCounts = new HashMap<>();
        for (AdStatus status : AdStatus.values()) {
            statusCounts.put(status.name(), lineAdRepository.findAllActive().stream().filter(ad -> ad.getStatus() == status).count());
        }
        return Map.of("total", total, "statusCounts", statusCounts);
    }
}
