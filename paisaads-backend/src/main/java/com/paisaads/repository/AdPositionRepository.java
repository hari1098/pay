package com.paisaads.repository;

import com.paisaads.entity.AdPosition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AdPositionRepository extends JpaRepository<AdPosition, UUID> {
}
