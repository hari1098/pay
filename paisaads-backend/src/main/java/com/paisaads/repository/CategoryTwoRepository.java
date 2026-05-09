package com.paisaads.repository;

import com.paisaads.entity.CategoryTwo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryTwoRepository extends JpaRepository<CategoryTwo, UUID> {

    List<CategoryTwo> findByIsActiveTrue();

    List<CategoryTwo> findByParentIdAndIsActiveTrue(UUID parentId);
}
