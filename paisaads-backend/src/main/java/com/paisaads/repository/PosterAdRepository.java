package com.paisaads.repository;

import com.paisaads.entity.PosterAd;
import com.paisaads.enums.AdStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface PosterAdRepository extends JpaRepository<PosterAd, UUID> {
    List<PosterAd> findByCustomerIdAndIsActiveTrueOrderByCreatedAtDesc(UUID customerId);
    
    List<PosterAd> findByStatusInAndIsActiveTrueOrderByCreatedAtDesc(List<AdStatus> statuses);
    
    @Query("SELECT pa FROM PosterAd pa LEFT JOIN FETCH pa.customer c LEFT JOIN FETCH c.user LEFT JOIN FETCH pa.mainCategory LEFT JOIN FETCH pa.categoryOne LEFT JOIN FETCH pa.categoryTwo LEFT JOIN FETCH pa.categoryThree LEFT JOIN FETCH pa.image LEFT JOIN FETCH pa.position WHERE pa.isActive = true ORDER BY pa.createdAt DESC")
    List<PosterAd> findAllActive();
    
    @Query("SELECT pa FROM PosterAd pa LEFT JOIN FETCH pa.customer c LEFT JOIN FETCH c.user LEFT JOIN FETCH pa.mainCategory LEFT JOIN FETCH pa.categoryOne LEFT JOIN FETCH pa.categoryTwo LEFT JOIN FETCH pa.categoryThree LEFT JOIN FETCH pa.image LEFT JOIN FETCH pa.position WHERE pa.customer.id = :customerId AND pa.isActive = true ORDER BY pa.createdAt DESC")
    List<PosterAd> findByCustomerIdFull(@Param("customerId") UUID customerId);
}
