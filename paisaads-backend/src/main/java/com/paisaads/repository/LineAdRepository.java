package com.paisaads.repository;

import com.paisaads.entity.LineAd;
import com.paisaads.enums.AdStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LineAdRepository extends JpaRepository<LineAd, UUID> {

    List<LineAd> findByStatus(AdStatus status);

    List<LineAd> findByStatusAndIsActiveTrue(AdStatus status);

    List<LineAd> findByCustomerIdAndIsActiveTrue(UUID customerId);

    List<LineAd> findByCustomerId(UUID customerId);

    @Query("SELECT la FROM LineAd la WHERE la.status = 'PUBLISHED' AND la.isActive = true ORDER BY la.sequenceNumber ASC, la.createdAt DESC")
    List<LineAd> findPublishedAds();

    long countByStatus(AdStatus status);

    long countByCustomerIdAndStatus(UUID customerId, AdStatus status);

    long countByCustomerId(UUID customerId);
}
