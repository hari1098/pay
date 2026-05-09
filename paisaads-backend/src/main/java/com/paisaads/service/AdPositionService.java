package com.paisaads.service;

import com.paisaads.entity.*;
import com.paisaads.enums.*;
import com.paisaads.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdPositionService {

    private final AdPositionRepository adPositionRepository;
    private final LineAdRepository lineAdRepository;
    private final PosterAdRepository posterAdRepository;
    private final VideoAdRepository videoAdRepository;

    @Transactional
    public AdPosition create(AdType adType, PageType pageType, PositionType side, Integer position) {
        AdPosition adPosition = new AdPosition();
        adPosition.setAdType(adType);
        adPosition.setPageType(pageType != null ? pageType : PageType.HOME);
        adPosition.setSide(side);
        adPosition.setPosition(position != null ? position : 0);
        return adPositionRepository.save(adPosition);
    }

    public List<AdPosition> findAll() {
        return adPositionRepository.findAll();
    }

    public AdPosition findOne(UUID id) {
        return adPositionRepository.findById(id).orElse(null);
    }

    @Transactional
    public AdPosition update(UUID id, PageType pageType, PositionType side, Integer position) {
        AdPosition adPosition = adPositionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("AdPosition not found"));
        if (pageType != null) adPosition.setPageType(pageType);
        if (side != null) adPosition.setSide(side);
        if (position != null) adPosition.setPosition(position);
        return adPositionRepository.save(adPosition);
    }

    @Transactional
    public void remove(UUID id) {
        adPositionRepository.deleteById(id);
    }

    public Map<String, Object> getAdSlotsOverview(PageType pageType, String category) {
        Map<String, Object> result = new HashMap<>();
        List<AdPosition> positions = filterPositions(pageType, category);

        Map<String, Object> leftSide = buildSideOverview(positions, PositionType.LEFT_SIDE);
        Map<String, Object> rightSide = buildSideOverview(positions, PositionType.RIGHT_SIDE);
        Map<String, Object> centerTop = buildSideOverview(positions, PositionType.CENTER_TOP);
        Map<String, Object> centerBottom = buildSideOverview(positions, PositionType.CENTER_BOTTOM);

        result.put("leftSide", leftSide);
        result.put("rightSide", rightSide);
        result.put("centerTop", centerTop);
        result.put("centerBottom", centerBottom);
        result.put("pageType", pageType != null ? pageType.name() : "ALL");
        return result;
    }

    public Map<String, Object> getLineAds(PageType pageType, String category) {
        List<LineAd> ads = lineAdRepository.findAllActive().stream()
            .filter(ad -> ad.getStatus() == AdStatus.PUBLISHED && ad.getIsActive())
            .filter(ad -> pageType == null || (ad.getPosition() != null && ad.getPosition().getPageType() == pageType))
            .filter(ad -> category == null || ad.getMainCategory().getId().toString().equals(category))
            .collect(Collectors.toList());

        String today = LocalDate.now().toString();
        List<LineAd> todayAds = ads.stream()
            .filter(ad -> ad.getDatesList().stream().anyMatch(d -> d.startsWith(today)))
            .collect(Collectors.toList());

        return Map.of("today", todayAds, "total", ads.size(), "pageType",
            pageType != null ? pageType.name() : "ALL");
    }

    public Map<String, Object> getSlotDetails(PageType pageType, PositionType side, int position, String category) {
        List<AdPosition> slots = filterPositions(pageType, category).stream()
            .filter(p -> p.getSide() == side && p.getPosition() == position)
            .collect(Collectors.toList());

        return buildSlotDetailsResponse(slots, pageType, side, position);
    }

    public Map<String, Object> getAvailableDates() {
        Set<String> dates = new TreeSet<>();
        lineAdRepository.findAllActive().stream()
            .filter(ad -> ad.getStatus() == AdStatus.PUBLISHED)
            .forEach(ad -> dates.addAll(ad.getDatesList()));
        posterAdRepository.findAllActive().stream()
            .filter(ad -> ad.getStatus() == AdStatus.PUBLISHED)
            .forEach(ad -> dates.addAll(ad.getDatesList()));
        videoAdRepository.findAllActive().stream()
            .filter(ad -> ad.getStatus() == AdStatus.PUBLISHED)
            .forEach(ad -> dates.addAll(ad.getDatesList()));

        return Map.of("dates", new ArrayList<>(dates));
    }

    public Map<String, Object> getAdSlotsByDate(String date, PageType pageType, String category) {
        Map<String, Object> result = new HashMap<>();
        List<AdPosition> positions = filterPositions(pageType, category);

        Map<String, Object> leftSide = buildSideOverviewByDate(positions, PositionType.LEFT_SIDE, date);
        Map<String, Object> rightSide = buildSideOverviewByDate(positions, PositionType.RIGHT_SIDE, date);
        Map<String, Object> centerTop = buildSideOverviewByDate(positions, PositionType.CENTER_TOP, date);
        Map<String, Object> centerBottom = buildSideOverviewByDate(positions, PositionType.CENTER_BOTTOM, date);

        result.put("leftSide", leftSide);
        result.put("rightSide", rightSide);
        result.put("centerTop", centerTop);
        result.put("centerBottom", centerBottom);
        result.put("date", date);
        result.put("pageType", pageType != null ? pageType.name() : "ALL");
        return result;
    }

    public Map<String, Object> getLineAdsByDate(String date, PageType pageType, String category) {
        List<LineAd> ads = lineAdRepository.findAllActive().stream()
            .filter(ad -> ad.getStatus() == AdStatus.PUBLISHED && ad.getIsActive())
            .filter(ad -> ad.getDatesList().stream().anyMatch(d -> d.startsWith(date)))
            .filter(ad -> pageType == null || (ad.getPosition() != null && ad.getPosition().getPageType() == pageType))
            .filter(ad -> category == null || ad.getMainCategory().getId().toString().equals(category))
            .collect(Collectors.toList());

        return Map.of("ads", ads, "total", ads.size(), "date", date,
            "pageType", pageType != null ? pageType.name() : "ALL");
    }

    public Map<String, Object> getSlotDetailsByDate(String date, PageType pageType, PositionType side, int position, String category) {
        List<AdPosition> slots = filterPositions(pageType, category).stream()
            .filter(p -> p.getSide() == side && p.getPosition() == position)
            .collect(Collectors.toList());

        Map<String, Object> result = buildSlotDetailsResponse(slots, pageType, side, position);
        result.put("date", date);
        return result;
    }

    private List<AdPosition> filterPositions(PageType pageType, String category) {
        List<AdPosition> positions = adPositionRepository.findAll();
        if (pageType != null) {
            positions = positions.stream().filter(p -> p.getPageType() == pageType).collect(Collectors.toList());
        }
        if (category != null) {
            positions = positions.stream().filter(p -> {
                if (p.getLineAd() != null && p.getLineAd().getMainCategory() != null
                    && p.getLineAd().getMainCategory().getId().toString().equals(category)) return true;
                if (p.getPosterAd() != null && p.getPosterAd().getMainCategory() != null
                    && p.getPosterAd().getMainCategory().getId().toString().equals(category)) return true;
                if (p.getVideoAd() != null && p.getVideoAd().getMainCategory() != null
                    && p.getVideoAd().getMainCategory().getId().toString().equals(category)) return true;
                return false;
            }).collect(Collectors.toList());
        }
        return positions;
    }

    private Map<String, Object> buildSideOverview(List<AdPosition> positions, PositionType side) {
        List<AdPosition> sidePositions = positions.stream()
            .filter(p -> p.getSide() == side)
            .collect(Collectors.toList());

        long total = sidePositions.size();
        long occupied = sidePositions.stream().filter(p -> {
            if (p.getAdType() == AdType.LINE && p.getLineAd() != null) return true;
            if (p.getAdType() == AdType.POSTER && p.getPosterAd() != null) return true;
            if (p.getAdType() == AdType.VIDEO && p.getVideoAd() != null) return true;
            return false;
        }).count();

        return Map.of("totalSlots", total, "occupiedSlots", occupied,
            "availableSlots", total - occupied, "positions", sidePositions);
    }

    private Map<String, Object> buildSideOverviewByDate(List<AdPosition> positions, PositionType side, String date) {
        List<AdPosition> sidePositions = positions.stream()
            .filter(p -> p.getSide() == side)
            .collect(Collectors.toList());

        long total = sidePositions.size();
        long occupied = sidePositions.stream().filter(p -> {
            if (p.getAdType() == AdType.LINE && p.getLineAd() != null
                && p.getLineAd().getDatesList().stream().anyMatch(d -> d.startsWith(date))) return true;
            if (p.getAdType() == AdType.POSTER && p.getPosterAd() != null
                && p.getPosterAd().getDatesList().stream().anyMatch(d -> d.startsWith(date))) return true;
            if (p.getAdType() == AdType.VIDEO && p.getVideoAd() != null
                && p.getVideoAd().getDatesList().stream().anyMatch(d -> d.startsWith(date))) return true;
            return false;
        }).count();

        return Map.of("totalSlots", total, "occupiedSlots", occupied,
            "availableSlots", total - occupied, "positions", sidePositions);
    }

    private Map<String, Object> buildSlotDetailsResponse(List<AdPosition> slots, PageType pageType, PositionType side, int position) {
        Map<String, Object> details = new HashMap<>();
        details.put("pageType", pageType != null ? pageType.name() : "ALL");
        details.put("side", side.name());
        details.put("position", position);

        List<Map<String, Object>> ads = new ArrayList<>();
        for (AdPosition slot : slots) {
            Map<String, Object> adInfo = new HashMap<>();
            adInfo.put("id", slot.getId());
            adInfo.put("adType", slot.getAdType() != null ? slot.getAdType().name() : null);
            if (slot.getLineAd() != null) adInfo.put("lineAd", slot.getLineAd());
            if (slot.getPosterAd() != null) adInfo.put("posterAd", slot.getPosterAd());
            if (slot.getVideoAd() != null) adInfo.put("videoAd", slot.getVideoAd());
            ads.add(adInfo);
        }
        details.put("ads", ads);
        return details;
    }
}
