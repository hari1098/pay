package com.paisaads.repository;

import com.paisaads.entity.CategoryThree;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CategoryThreeRepository extends JpaRepository<CategoryThree, UUID> {
}
