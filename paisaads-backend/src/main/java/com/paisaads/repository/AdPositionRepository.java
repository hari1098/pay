package com.paisaads.repository;

import com.paisaads.entity.AdPosition;
import com.paisaads.enums.AdType;
import com.paisaads.enums.PageType;
import com.paisaads.enums.PositionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AdPositionRepository extends JpaRepository<AdPosition, UUID> {
    List<AdPosition> findByPageTypeAndSideAndPositionAndAdType(PageType pageType, PositionType side, Integer position, AdType adType);
    List<AdPosition> findByAdType(AdType adType);
    List<AdPosition> findByAdTypeAndPageType(AdType adType, PageType pageType);
}
