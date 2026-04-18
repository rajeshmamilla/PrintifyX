package com.printifyx.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String toEmail, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("PrintifyX <no-reply@printifyx.com>");
        message.setTo(toEmail);
        message.setSubject("Your PrintifyX Verification Code");
        message.setText("Dear User,\n\n" +
                "Your verification code is: " + otpCode + "\n\n" +
                "This code will expire in 5 minutes. Please do not share this code with anyone.\n\n" +
                "Regards,\n" +
                "Team PrintifyX");
        
        mailSender.send(message);
    }
}
