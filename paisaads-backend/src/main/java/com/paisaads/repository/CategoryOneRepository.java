package com.paisaads.repository;

import com.paisaads.entity.CategoryOne;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CategoryOneRepository extends JpaRepository<CategoryOne, UUID> {
}
