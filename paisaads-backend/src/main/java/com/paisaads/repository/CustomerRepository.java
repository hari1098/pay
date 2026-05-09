package com.paisaads.repository;

import com.paisaads.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface CustomerRepository extends JpaRepository<Customer, UUID> {
    Optional<Customer> findByUserId(UUID userId);
    
    @Query("SELECT c FROM Customer c LEFT JOIN FETCH c.user WHERE c.id = :id")
    Optional<Customer> findByIdWithUser(@Param("id") UUID id);
}
