package com.paisaads.repository;

import com.paisaads.entity.LineAd;
import com.paisaads.enums.AdStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface LineAdRepository extends JpaRepository<LineAd, UUID> {
    List<LineAd> findByCustomerIdAndIsActiveTrueOrderByCreatedAtDesc(UUID customerId);
    
    List<LineAd> findByStatusInAndIsActiveTrueOrderByCreatedAtDesc(List<AdStatus> statuses);
    
    @Query("SELECT la FROM LineAd la LEFT JOIN FETCH la.customer c LEFT JOIN FETCH c.user LEFT JOIN FETCH la.mainCategory LEFT JOIN FETCH la.categoryOne LEFT JOIN FETCH la.categoryTwo LEFT JOIN FETCH la.categoryThree LEFT JOIN FETCH la.images LEFT JOIN FETCH la.position WHERE la.isActive = true ORDER BY la.createdAt DESC")
    List<LineAd> findAllActive();
    
    @Query("SELECT la FROM LineAd la LEFT JOIN FETCH la.customer c LEFT JOIN FETCH c.user LEFT JOIN FETCH la.mainCategory LEFT JOIN FETCH la.categoryOne LEFT JOIN FETCH la.categoryTwo LEFT JOIN FETCH la.categoryThree LEFT JOIN FETCH la.images LEFT JOIN FETCH la.position WHERE la.customer.id = :customerId AND la.isActive = true ORDER BY la.createdAt DESC")
    List<LineAd> findByCustomerIdFull(@Param("customerId") UUID customerId);
}
