package com.paisaads.repository;

import com.paisaads.entity.MainCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MainCategoryRepository extends JpaRepository<MainCategory, UUID> {

    List<MainCategory> findByIsActiveTrue();
}
