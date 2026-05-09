package com.paisaads.repository;

import com.paisaads.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByPhoneNumber(String phoneNumber);
    
    Optional<User> findByEmail(String email);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.customer LEFT JOIN FETCH u.admin WHERE u.id = :id")
    Optional<User> findByIdWithRelations(@Param("id") UUID id);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.customer c LEFT JOIN FETCH u.admin WHERE u.phoneNumber = :identifier OR u.email = :identifier")
    Optional<User> findByPhoneOrEmailWithPassword(@Param("identifier") String identifier);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.customer LEFT JOIN FETCH u.admin")
    java.util.List<User> findAllWithRelations();
}
