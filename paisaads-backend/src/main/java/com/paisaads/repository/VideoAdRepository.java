package com.paisaads.repository;

import com.paisaads.entity.VideoAd;
import com.paisaads.enums.AdStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VideoAdRepository extends JpaRepository<VideoAd, UUID> {

    List<VideoAd> findByStatus(AdStatus status);

    List<VideoAd> findByStatusAndIsActiveTrue(AdStatus status);

    List<VideoAd> findByCustomerIdAndIsActiveTrue(UUID customerId);

    List<VideoAd> findByCustomerId(UUID customerId);

    @Query("SELECT va FROM VideoAd va WHERE va.status = 'PUBLISHED' AND va.isActive = true ORDER BY va.sequenceNumber ASC, va.createdAt DESC")
    List<VideoAd> findPublishedAds();

    long countByStatus(AdStatus status);

    long countByCustomerIdAndStatus(UUID customerId, AdStatus status);

    long countByCustomerId(UUID customerId);
}
