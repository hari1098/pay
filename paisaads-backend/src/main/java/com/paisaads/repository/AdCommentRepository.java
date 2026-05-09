package com.paisaads.repository;

import com.paisaads.entity.AdComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AdCommentRepository extends JpaRepository<AdComment, UUID> {
}
