package com.paisaads.repository;

import com.paisaads.entity.CategoryThree;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryThreeRepository extends JpaRepository<CategoryThree, UUID> {

    List<CategoryThree> findByIsActiveTrue();

    List<CategoryThree> findByParentIdAndIsActiveTrue(UUID parentId);
}
