package com.paisaads.repository;

import com.paisaads.entity.AdStatus;
import com.paisaads.entity.PosterAd;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PosterAdRepository extends JpaRepository<PosterAd, UUID> {

    List<PosterAd> findByIsActiveTrueAndStatusIn(List<AdStatus> statuses, Sort sort);

    List<PosterAd> findByCustomerId(UUID customerId, Sort sort);

    List<PosterAd> findByStatus(AdStatus status);
}
