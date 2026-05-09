package com.paisaads.repository;

import com.paisaads.entity.AdStatus;
import com.paisaads.entity.LineAd;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LineAdRepository extends JpaRepository<LineAd, UUID> {

    List<LineAd> findByIsActiveTrueAndStatusIn(List<AdStatus> statuses, Sort sort);

    List<LineAd> findByCustomerId(UUID customerId, Sort sort);

    List<LineAd> findByStatus(AdStatus status);
}
