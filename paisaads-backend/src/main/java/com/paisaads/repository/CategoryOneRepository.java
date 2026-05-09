package com.paisaads.repository;

import com.paisaads.entity.CategoryOne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryOneRepository extends JpaRepository<CategoryOne, UUID> {

    List<CategoryOne> findByIsActiveTrue();

    List<CategoryOne> findByParentIdAndIsActiveTrue(UUID parentId);
}
