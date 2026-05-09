package com.paisaads.repository;

import com.paisaads.entity.AdComment;
import com.paisaads.enums.AdStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AdCommentRepository extends JpaRepository<AdComment, UUID> {
    List<AdComment> findByLineAdIdAndIsActiveTrueOrderByActionTimestampDesc(UUID lineAdId);
    List<AdComment> findByPosterAdIdAndIsActiveTrueOrderByActionTimestampDesc(UUID posterAdId);
    List<AdComment> findByVideoAdIdAndIsActiveTrueOrderByActionTimestampDesc(UUID videoAdId);
    List<AdComment> findByLineAdIdAndActionTypeAndIsActiveTrue(UUID lineAdId, AdStatus actionType);
    List<AdComment> findByPosterAdIdAndActionTypeAndIsActiveTrue(UUID posterAdId, AdStatus actionType);
    List<AdComment> findByVideoAdIdAndActionTypeAndIsActiveTrue(UUID videoAdId, AdStatus actionType);
    List<AdComment> findByLineAdIdAndIsActive(UUID lineAdId, Boolean isActive);
    List<AdComment> findByPosterAdIdAndIsActive(UUID posterAdId, Boolean isActive);
    List<AdComment> findByVideoAdIdAndIsActive(UUID videoAdId, Boolean isActive);
}
