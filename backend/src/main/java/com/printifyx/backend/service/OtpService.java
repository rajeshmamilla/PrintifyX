package com.printifyx.backend.service;

import com.printifyx.backend.entity.OtpVerification;
import com.printifyx.backend.repository.OtpVerificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    private final OtpVerificationRepository otpRepository;
    private final EmailService emailService;

    public OtpService(OtpVerificationRepository otpRepository, EmailService emailService) {
        this.otpRepository = otpRepository;
        this.emailService = emailService;
    }

    @Transactional
    public void sendOtp(String email, String purpose) {
        // Clear any previous codes for this email to prevent confusion
        otpRepository.deleteByEmail(email);

        // Generate 6-digit OTP
        String otpCode = String.format("%06d", new Random().nextInt(999999));

        OtpVerification otpVerification = new OtpVerification();
        otpVerification.setEmail(email);
        otpVerification.setOtpCode(otpCode);
        otpVerification.setPurpose(purpose);
        otpVerification.setCreatedAt(LocalDateTime.now());
        otpVerification.setExpires_at(LocalDateTime.now().plusMinutes(5));
        otpVerification.setVerified(false);

        otpRepository.save(otpVerification);
        emailService.sendOtpEmail(email, otpCode);
    }

    public boolean verifyOtp(String email, String otpCode, String purpose) {
        Optional<OtpVerification> opt = otpRepository.findByEmailAndOtpCodeAndPurpose(email, otpCode, purpose);

        if (opt.isPresent()) {
            OtpVerification otp = opt.get();
            if (!otp.isExpired()) {
                otp.setVerified(true);
                otpRepository.save(otp);
                return true;
            }
        }
        return false;
    }

    public boolean isEmailVerified(String email, String purpose) {
        return otpRepository.findTopByEmailAndPurposeAndVerifiedOrderByCreatedAtDesc(email, purpose, true)
                .map(otp -> !otp.isExpired())
                .orElse(false);
    }
}
