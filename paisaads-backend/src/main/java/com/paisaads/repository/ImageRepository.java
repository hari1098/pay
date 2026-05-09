package com.paisaads.repository;

import com.paisaads.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ImageRepository extends JpaRepository<Image, UUID> {

    List<Image> findByIsTempTrue();

    List<Image> findByPosterAdId(UUID posterAdId);

    List<Image> findByVideoAdId(UUID videoAdId);

    List<Image> findByLineAdId(UUID lineAdId);
}
