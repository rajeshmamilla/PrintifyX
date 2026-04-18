package com.printifyx.backend.repository;

import com.printifyx.backend.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findByEmailAndOtpCodeAndPurpose(String email, String otpCode, String purpose);
    Optional<OtpVerification> findTopByEmailAndPurposeAndVerifiedOrderByCreatedAtDesc(String email, String purpose, boolean verified);
    @jakarta.transaction.Transactional
    @org.springframework.data.jpa.repository.Modifying
    void deleteByEmail(String email);
}
