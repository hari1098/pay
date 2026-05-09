package com.paisaads.controller;

import com.paisaads.dto.CreateAdPositionDto;
import com.paisaads.entity.AdPosition;
import com.paisaads.enums.AdType;
import com.paisaads.enums.PageType;
import com.paisaads.enums.PositionType;
import com.paisaads.service.AdPositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/ad-position")
@RequiredArgsConstructor
public class AdPositionController {

    private final AdPositionService adPositionService;

    @PostMapping
    public ResponseEntity<AdPosition> create(@RequestBody CreateAdPositionDto dto) {
        AdType adType = AdType.valueOf(dto.getAdType());
        PageType pageType = dto.getPageType() != null ? PageType.valueOf(dto.getPageType()) : PageType.HOME;
        PositionType side = dto.getSide() != null ? PositionType.valueOf(dto.getSide()) : null;
        Integer position = dto.getPosition() != null ? dto.getPosition() : 0;
        return ResponseEntity.ok(adPositionService.create(adType, pageType, side, position));
    }

    @GetMapping
    public ResponseEntity<List<AdPosition>> findAll() {
        return ResponseEntity.ok(adPositionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdPosition> findOne(@PathVariable UUID id) {
        AdPosition pos = adPositionService.findOne(id);
        if (pos == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(pos);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AdPosition> update(
            @PathVariable UUID id,
            @RequestBody CreateAdPositionDto dto) {
        PageType pageType = dto.getPageType() != null ? PageType.valueOf(dto.getPageType()) : null;
        PositionType side = dto.getSide() != null ? PositionType.valueOf(dto.getSide()) : null;
        Integer position = dto.getPosition();
        return ResponseEntity.ok(adPositionService.update(id, pageType, side, position));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> remove(@PathVariable UUID id) {
        adPositionService.remove(id);
        return ResponseEntity.ok(Map.of("message", "Ad position deleted successfully"));
    }

    @GetMapping("/ad-slots/overview")
    public ResponseEntity<Map<String, Object>> getAdSlotsOverview(
            @RequestParam(required = false) PageType pageType,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(adPositionService.getAdSlotsOverview(pageType, category));
    }

    @GetMapping("/ad-slots/line-ads")
    public ResponseEntity<Map<String, Object>> getLineAds(
            @RequestParam(required = false) PageType pageType,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(adPositionService.getLineAds(pageType, category));
    }

    @GetMapping("/ad-slots/slot-details/{pageType}/{side}/{position}")
    public ResponseEntity<Map<String, Object>> getSlotDetails(
            @PathVariable PageType pageType,
            @PathVariable PositionType side,
            @PathVariable String position,
            @RequestParam(required = false) String category) {
        int positionNum = Integer.parseInt(position);
        if (positionNum < 1 || positionNum > 6) {
            return ResponseEntity.badRequest().build();
        }
        if ((side == PositionType.CENTER_TOP || side == PositionType.CENTER_BOTTOM) && positionNum != 1) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(adPositionService.getSlotDetails(pageType, side, positionNum, category));
    }

    @GetMapping("/ad-slots/available-dates")
    public ResponseEntity<Map<String, Object>> getAvailableDates() {
        return ResponseEntity.ok(adPositionService.getAvailableDates());
    }

    @GetMapping("/ad-slots/by-date/overview")
    public ResponseEntity<Map<String, Object>> getAdSlotsByDate(
            @RequestParam String date,
            @RequestParam(required = false) PageType pageType,
            @RequestParam(required = false) String category) {
        if (!date.matches("\\d{4}-\\d{2}-\\d{2}")) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(adPositionService.getAdSlotsByDate(date, pageType, category));
    }

    @GetMapping("/ad-slots/by-date/line-ads")
    public ResponseEntity<Map<String, Object>> getLineAdsByDate(
            @RequestParam String date,
            @RequestParam(required = false) PageType pageType,
            @RequestParam(required = false) String category) {
        if (!date.matches("\\d{4}-\\d{2}-\\d{2}")) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(adPositionService.getLineAdsByDate(date, pageType, category));
    }

    @GetMapping("/ad-slots/by-date/slot-details/{pageType}/{side}/{position}")
    public ResponseEntity<Map<String, Object>> getSlotDetailsByDate(
            @RequestParam String date,
            @PathVariable PageType pageType,
            @PathVariable PositionType side,
            @PathVariable String position,
            @RequestParam(required = false) String category) {
        if (!date.matches("\\d{4}-\\d{2}-\\d{2}")) {
            return ResponseEntity.badRequest().build();
        }
        int positionNum = Integer.parseInt(position);
        if (positionNum < 1 || positionNum > 6) {
            return ResponseEntity.badRequest().build();
        }
        if ((side == PositionType.CENTER_TOP || side == PositionType.CENTER_BOTTOM) && positionNum != 1) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(adPositionService.getSlotDetailsByDate(date, pageType, side, positionNum, category));
    }
}
