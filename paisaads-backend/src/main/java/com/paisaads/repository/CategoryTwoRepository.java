package com.paisaads.repository;

import com.paisaads.entity.CategoryTwo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CategoryTwoRepository extends JpaRepository<CategoryTwo, UUID> {

    List<CategoryTwo> findByParentId(UUID parentId);
}
