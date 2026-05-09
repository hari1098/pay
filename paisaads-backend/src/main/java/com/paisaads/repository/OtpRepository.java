package com.paisaads.repository;

import com.paisaads.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OtpRepository extends JpaRepository<Otp, UUID> {
    Optional<Otp> findByPhoneNumberAndOtpCodeAndPurposeAndIsVerifiedFalseAndIsActiveTrue(String phoneNumber, String otpCode, String purpose);
    Optional<Otp> findByPhoneNumberAndPurposeAndIsVerifiedFalseAndIsActiveTrue(String phoneNumber, String purpose);
}
