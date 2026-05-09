package com.paisaads.repository;

import com.paisaads.entity.MainCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface MainCategoryRepository extends JpaRepository<MainCategory, UUID> {
    @Query("SELECT m FROM MainCategory m LEFT JOIN FETCH m.subCategories s1 LEFT JOIN FETCH s1.subCategories s2 LEFT JOIN FETCH s2.subCategories ORDER BY m.name ASC, s1.name ASC, s2.name ASC")
    List<MainCategory> findAllTrees();
}
