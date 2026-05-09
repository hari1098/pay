package com.paisaads.repository;

import com.paisaads.entity.AdComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AdCommentRepository extends JpaRepository<AdComment, UUID> {

    List<AdComment> findByAdIdAndAdTypeOrderByCreatedAtDesc(UUID adId, String adType);

    List<AdComment> findByAdTypeOrderByCreatedAtDesc(String adType);
}
