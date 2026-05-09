package com.paisaads.service;

import com.paisaads.dto.CreateVideoAdDto;
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
public class VideoAdService {

    private final VideoAdRepository videoAdRepository;
    private final CategoryService categoryService;
    private final UserService userService;
    private final AdPositionService adPositionService;
    private final ImageService imageService;

    @Transactional
    public VideoAd createAd(UUID userId, CreateVideoAdDto dto) {
        User user = userService.findOneById(userId);
        if (user.getCustomer() == null) throw new RuntimeException("User not found");

        PositionType side = dto.getSide() != null ? PositionType.valueOf(dto.getSide()) : null;
        AdPosition position = adPositionService.create(AdType.VIDEO, PageType.valueOf(dto.getPageType()), side, dto.getPosition());

        VideoAd ad = new VideoAd();
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

        return videoAdRepository.save(ad);
    }

    public List<Map<String, Object>> getTodayVideoAds(String categoryId, Integer stateId, Integer cityId) {
        String today = java.time.LocalDate.now().toString();
        return videoAdRepository.findAllActive().stream()
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

    public List<VideoAd> findAll(String categoryId, Integer stateId, Integer cityId) {
        List<VideoAd> ads = videoAdRepository.findAllActive();
        if (categoryId != null) ads = ads.stream().filter(ad -> ad.getMainCategory().getId().toString().equals(categoryId) || (ad.getCategoryOne() != null && ad.getCategoryOne().getId().toString().equals(categoryId)) || (ad.getCategoryTwo() != null && ad.getCategoryTwo().getId().toString().equals(categoryId)) || (ad.getCategoryThree() != null && ad.getCategoryThree().getId().toString().equals(categoryId))).collect(Collectors.toList());
        if (stateId != null) ads = ads.stream().filter(ad -> stateId.equals(ad.getSid())).collect(Collectors.toList());
        if (cityId != null) ads = ads.stream().filter(ad -> cityId.equals(ad.getCid())).collect(Collectors.toList());
        return ads;
    }

    public List<VideoAd> findAllByStatuses(List<AdStatus> statuses) { return videoAdRepository.findByStatusInAndIsActiveTrueOrderByCreatedAtDesc(statuses); }
    public List<VideoAd> findAllByUserId(UUID userId) { User user = userService.findOneById(userId); if (user.getCustomer() == null) return List.of(); return videoAdRepository.findByCustomerIdFull(user.getCustomer().getId()); }
    public List<VideoAd> findByCategory(String categoryId) { UUID catId = UUID.fromString(categoryId); return videoAdRepository.findAllActive().stream().filter(ad -> ad.getMainCategory().getId().equals(catId) || (ad.getCategoryOne() != null && ad.getCategoryOne().getId().equals(catId)) || (ad.getCategoryTwo() != null && ad.getCategoryTwo().getId().equals(catId)) || (ad.getCategoryThree() != null && ad.getCategoryThree().getId().equals(catId))).collect(Collectors.toList()); }
    public List<VideoAd> searchAds(String text, String city, String state, String categoryId, AdStatus status) { List<VideoAd> ads = videoAdRepository.findAllActive(); if (city != null) ads = ads.stream().filter(ad -> city.equals(ad.getCity())).collect(Collectors.toList()); if (state != null) ads = ads.stream().filter(ad -> state.equals(ad.getState())).collect(Collectors.toList()); if (categoryId != null) ads = findByCategory(categoryId); if (status != null) ads = ads.stream().filter(ad -> ad.getStatus() == status).collect(Collectors.toList()); return ads; }
    public VideoAd findOne(String id) { return videoAdRepository.findById(UUID.fromString(id)).orElseThrow(() -> new RuntimeException("Ad not found")); }

    @Transactional
    public VideoAd updateAdByUser(UUID userId, String adId, CreateVideoAdDto dto) {
        User user = userService.findOneById(userId);
        VideoAd ad = findOne(adId);
        if (!ad.getCustomer().getId().equals(user.getCustomer().getId())) throw new SecurityException("You can only update your own ads");
        applyUpdate(ad, dto);
        return videoAdRepository.save(ad);
    }

    @Transactional
    public VideoAd updateAdByAdmin(UUID userId, String adId, CreateVideoAdDto dto) {
        VideoAd ad = findOne(adId);
        if (ad.getStatus() == AdStatus.REJECTED) throw new IllegalArgumentException("Rejected ads cannot be edited");
        applyUpdate(ad, dto);
        return videoAdRepository.save(ad);
    }

    private void applyUpdate(VideoAd ad, CreateVideoAdDto dto) {
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
    public VideoAd updateAdStatus(String adId, AdStatus status) { VideoAd ad = findOne(adId); ad.setStatus(status); return videoAdRepository.save(ad); }

    @Transactional
    public void deleteAdByUser(UUID userId, String adId) {
        User user = userService.findOneById(userId);
        VideoAd ad = findOne(adId);
        if (!ad.getCustomer().getId().equals(user.getCustomer().getId())) throw new SecurityException("You can only delete your own ads");
        if (ad.getPosition() != null) adPositionService.remove(ad.getPosition().getId());
        ad.setIsActive(false);
        videoAdRepository.save(ad);
    }
}
