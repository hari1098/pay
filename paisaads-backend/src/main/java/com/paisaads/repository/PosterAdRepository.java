package com.paisaads.repository;

import com.paisaads.entity.PosterAd;
import com.paisaads.enums.AdStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PosterAdRepository extends JpaRepository<PosterAd, UUID> {

    List<PosterAd> findByStatus(AdStatus status);

    List<PosterAd> findByStatusAndIsActiveTrue(AdStatus status);

    List<PosterAd> findByCustomerIdAndIsActiveTrue(UUID customerId);

    List<PosterAd> findByCustomerId(UUID customerId);

    @Query("SELECT pa FROM PosterAd pa WHERE pa.status = 'PUBLISHED' AND pa.isActive = true ORDER BY pa.sequenceNumber ASC, pa.createdAt DESC")
    List<PosterAd> findPublishedAds();

    long countByStatus(AdStatus status);

    long countByCustomerIdAndStatus(UUID customerId, AdStatus status);

    long countByCustomerId(UUID customerId);
}
