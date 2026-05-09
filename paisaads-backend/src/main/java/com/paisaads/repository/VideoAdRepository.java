package com.paisaads.repository;

import com.paisaads.entity.VideoAd;
import com.paisaads.enums.AdStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface VideoAdRepository extends JpaRepository<VideoAd, UUID> {
    List<VideoAd> findByCustomerIdAndIsActiveTrueOrderByCreatedAtDesc(UUID customerId);
    
    List<VideoAd> findByStatusInAndIsActiveTrueOrderByCreatedAtDesc(List<AdStatus> statuses);
    
    @Query("SELECT va FROM VideoAd va LEFT JOIN FETCH va.customer c LEFT JOIN FETCH c.user LEFT JOIN FETCH va.mainCategory LEFT JOIN FETCH va.categoryOne LEFT JOIN FETCH va.categoryTwo LEFT JOIN FETCH va.categoryThree LEFT JOIN FETCH va.image LEFT JOIN FETCH va.position WHERE va.isActive = true ORDER BY va.createdAt DESC")
    List<VideoAd> findAllActive();
    
    @Query("SELECT va FROM VideoAd va LEFT JOIN FETCH va.customer c LEFT JOIN FETCH c.user LEFT JOIN FETCH va.mainCategory LEFT JOIN FETCH va.categoryOne LEFT JOIN FETCH va.categoryTwo LEFT JOIN FETCH va.categoryThree LEFT JOIN FETCH va.image LEFT JOIN FETCH va.position WHERE va.customer.id = :customerId AND va.isActive = true ORDER BY va.createdAt DESC")
    List<VideoAd> findByCustomerIdFull(@Param("customerId") UUID customerId);
}
