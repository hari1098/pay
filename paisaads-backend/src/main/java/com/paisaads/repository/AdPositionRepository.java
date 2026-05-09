package com.paisaads.repository;

import com.paisaads.entity.AdPosition;
import com.paisaads.enums.PageType;
import com.paisaads.enums.PositionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AdPositionRepository extends JpaRepository<AdPosition, UUID> {

    List<AdPosition> findByPageTypeAndSideOrderByPositionAsc(PageType pageType, PositionType side);

    List<AdPosition> findByPageTypeOrderByPositionAsc(PageType pageType);
}
