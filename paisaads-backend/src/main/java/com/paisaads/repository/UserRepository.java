package com.paisaads.repository;

import com.paisaads.entity.User;
import com.paisaads.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByPhoneNumber(String phoneNumber);

    Optional<User> findByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByIsActiveTrue();

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByEmail(String email);
}
