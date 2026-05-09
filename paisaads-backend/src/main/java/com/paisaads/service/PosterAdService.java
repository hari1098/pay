package com.paisaads.service;

import com.paisaads.dto.CreatePosterAdDto;
import com.paisaads.entity.*;
import com.paisaads.enums.*;
import com.paisaads.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PosterAdService {

    private final PosterAdRepository posterAdRepository;
    private final CategoryService categoryService;
    private final UserService userService;
    private final AdPositionService adPositionService;
    private final ImageService imageService;

    @Transactional
    public PosterAd createAd(UUID userId, CreatePosterAdDto dto) {
        User user = userService.findOneById(userId);
        if (user.getCustomer() == null) throw new RuntimeException("User not found");

        PositionType side = dto.getSide() != null ? PositionType.valueOf(dto.getSide()) : null;
        int posValue = (side == PositionType.CENTER_TOP || side == PositionType.CENTER_BOTTOM) ? 0 : (dto.getPosition() != null ? dto.getPosition() : 0);
        AdPosition position = adPositionService.create(AdType.POSTER, PageType.valueOf(dto.getPageType()), side, posValue);

        PosterAd ad = new PosterAd();
        ad.setPosition(position); ad.setCustomer(user.getCustomer());
        ad.setState(dto.getState()); ad.setSid(dto.getSid());
        ad.setCity(dto.getCity()); ad.setCid(dto.getCid());
        ad.setPostedBy(dto.getPostedBy() != null ? dto.getPostedBy() : user.getName());
        if (dto.getDates() != null) ad.setDatesList(dto.getDates());

        ad.setMainCategory(categoryService.findMainCategoryById(UUID.fromString(dto.getMainCategoryId())));
        if (dto.getCategoryOneId() != null) ad.setCategoryOne(categoryService.findCategoryOneById(UUID.fromString(dto.getCategoryOneId())));
        if (dto.getCategoryTwoId() != null) ad.setCategoryTwo(categoryService.findCategoryTwoById(UUID.fromString(dto.getCategoryTwoId())));
        if (dto.getCategoryThreeId() != null) ad.setCategoryThree(categoryService.findCategoryThreeById(UUID.fromString(dto.getCategoryThreeId())));
        if (dto.getImageId() != null) ad.setImage(imageService.confirmImage(UUID.fromString(dto.getImageId())));

        return posterAdRepository.save(ad);
    }

    public List<Map<String, Object>> getTodayPosterAds(String categoryId, Integer stateId, Integer cityId) {
        String today = java.time.LocalDate.now().toString();
        return posterAdRepository.findAllActive().stream()
            .filter(ad -> ad.getStatus() == AdStatus.PUBLISHED && ad.getIsActive())
            .filter(ad -> categoryId == null || ad.getMainCategory().getId().toString().equals(categoryId))
            .filter(ad -> stateId == null || stateId.equals(ad.getSid()))
            .filter(ad -> cityId == null || cityId.equals(ad.getCid()))
            .filter(ad -> ad.getDatesList().stream().anyMatch(d -> d.startsWith(today)))
            .map(ad -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", ad.getId()); map.put("state", ad.getState());
                map.put("city", ad.getCity()); map.put("postedBy", ad.getPostedBy());
                map.put("image", ad.getImage()); map.put("mainCategory", ad.getMainCategory());
                map.put("categoryOne", ad.getCategoryOne()); map.put("categoryTwo", ad.getCategoryTwo());
                map.put("categoryThree", ad.getCategoryThree()); map.put("position", ad.getPosition());
                map.put("createdAt", ad.getCreatedAt()); map.put("updatedAt", ad.getUpdatedAt());
                map.put("customerName", ad.getCustomer() != null && ad.getCustomer().getUser() != null ? ad.getCustomer().getUser().getName() : null);
                map.put("cityId", ad.getCid()); map.put("stateId", ad.getSid());
                return map;
            }).collect(Collectors.toList());
    }

    public List<PosterAd> findAll(String categoryId, Integer stateId, Integer cityId) {
        List<PosterAd> ads = posterAdRepository.findAllActive();
        if (categoryId != null) ads = ads.stream().filter(ad -> ad.getMainCategory().getId().toString().equals(categoryId) ||
            (ad.getCategoryOne() != null && ad.getCategoryOne().getId().toString().equals(categoryId)) ||
            (ad.getCategoryTwo() != null && ad.getCategoryTwo().getId().toString().equals(categoryId)) ||
            (ad.getCategoryThree() != null && ad.getCategoryThree().getId().toString().equals(categoryId))).collect(Collectors.toList());
        if (stateId != null) ads = ads.stream().filter(ad -> stateId.equals(ad.getSid())).collect(Collectors.toList());
        if (cityId != null) ads = ads.stream().filter(ad -> cityId.equals(ad.getCid())).collect(Collectors.toList());
        return ads;
    }

    public List<PosterAd> findAllByStatuses(List<AdStatus> statuses) { return posterAdRepository.findByStatusInAndIsActiveTrueOrderByCreatedAtDesc(statuses); }
    public List<PosterAd> findAllByUserId(UUID userId) { User user = userService.findOneById(userId); if (user.getCustomer() == null) return List.of(); return posterAdRepository.findByCustomerIdFull(user.getCustomer().getId()); }
    public List<PosterAd> findByCategory(String categoryId) { UUID catId = UUID.fromString(categoryId); return posterAdRepository.findAllActive().stream().filter(ad -> ad.getMainCategory().getId().equals(catId) || (ad.getCategoryOne() != null && ad.getCategoryOne().getId().equals(catId)) || (ad.getCategoryTwo() != null && ad.getCategoryTwo().getId().equals(catId)) || (ad.getCategoryThree() != null && ad.getCategoryThree().getId().equals(catId))).collect(Collectors.toList()); }
    
    public List<PosterAd> searchAds(String text, String city, String state, String categoryId, AdStatus status) {
        List<PosterAd> ads = posterAdRepository.findAllActive();
        if (city != null) ads = ads.stream().filter(ad -> city.equals(ad.getCity())).collect(Collectors.toList());
        if (state != null) ads = ads.stream().filter(ad -> state.equals(ad.getState())).collect(Collectors.toList());
        if (categoryId != null) ads = findByCategory(categoryId);
        if (status != null) ads = ads.stream().filter(ad -> ad.getStatus() == status).collect(Collectors.toList());
        return ads;
    }

    public PosterAd findOne(String id) { return posterAdRepository.findById(UUID.fromString(id)).orElseThrow(() -> new RuntimeException("Ad not found")); }

    @Transactional
    public PosterAd updateAdByUser(UUID userId, String adId, CreatePosterAdDto dto) {
        User user = userService.findOneById(userId);
        PosterAd ad = findOne(adId);
        if (!ad.getCustomer().getId().equals(user.getCustomer().getId())) throw new SecurityException("You can only edit your own ad");
        if (ad.getStatus() == AdStatus.REJECTED) throw new IllegalArgumentException("Rejected ads cannot be edited");
        if (ad.getStatus() != AdStatus.DRAFT && ad.getStatus() != AdStatus.HOLD) throw new IllegalArgumentException("Ad can only be edited in DRAFT or HOLD status");
        applyUpdate(ad, dto);
        return posterAdRepository.save(ad);
    }

    @Transactional
    public PosterAd updateAdByAdmin(UUID userId, String adId, CreatePosterAdDto dto) {
        PosterAd ad = findOne(adId);
        if (ad.getStatus() == AdStatus.REJECTED) throw new IllegalArgumentException("Rejected ads cannot be edited");
        applyUpdate(ad, dto);
        return posterAdRepository.save(ad);
    }

    private void applyUpdate(PosterAd ad, CreatePosterAdDto dto) {
        if (dto.getMainCategoryId() != null) ad.setMainCategory(categoryService.findMainCategoryById(UUID.fromString(dto.getMainCategoryId())));
        if (dto.getCategoryOneId() != null) ad.setCategoryOne(categoryService.findCategoryOneById(UUID.fromString(dto.getCategoryOneId())));
        if (dto.getCategoryTwoId() != null) ad.setCategoryTwo(categoryService.findCategoryTwoById(UUID.fromString(dto.getCategoryTwoId())));
        if (dto.getCategoryThreeId() != null) ad.setCategoryThree(categoryService.findCategoryThreeById(UUID.fromString(dto.getCategoryThreeId())));
        if (dto.getImageId() != null) ad.setImage(imageService.confirmImage(UUID.fromString(dto.getImageId())));
        if (dto.getState() != null) ad.setState(dto.getState());
        if (dto.getSid() != null) ad.setSid(dto.getSid());
        if (dto.getCity() != null) ad.setCity(dto.getCity());
        if (dto.getCid() != null) ad.setCid(dto.getCid());
        if (dto.getPostedBy() != null) ad.setPostedBy(dto.getPostedBy());
        if (dto.getDates() != null) ad.setDatesList(dto.getDates());
    }

    @Transactional
    public PosterAd updateAdStatus(String adId, AdStatus status) { PosterAd ad = findOne(adId); ad.setStatus(status); return posterAdRepository.save(ad); }

    @Transactional
    public PosterAd deleteAd(String adId, UUID userId) {
        PosterAd ad = findOne(adId);
        if (ad.getPosition() != null) adPositionService.remove(ad.getPosition().getId());
        ad.setIsActive(false);
        return posterAdRepository.save(ad);
    }
}
