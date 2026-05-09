package com.paisaads.repository;

import com.paisaads.entity.AdStatus;
import com.paisaads.entity.VideoAd;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface VideoAdRepository extends JpaRepository<VideoAd, UUID> {

    List<VideoAd> findByIsActiveTrueAndStatusIn(List<AdStatus> statuses, Sort sort);

    List<VideoAd> findByCustomerId(UUID customerId, Sort sort);

    List<VideoAd> findByStatus(AdStatus status);
}
