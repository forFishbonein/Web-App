package com.gym.service.impl;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import com.gym.service.MailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class MailServiceImpl implements MailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async("mailAsyncExecutor")
    @Override
    public void sendVerificationCode(String toEmail, String code) {
        String subject = "Fitness App - Verification Code";
        String text = "Hello,\n\nYour verification code is: " + code + "\n\nPlease complete the verification within 5 minutes.";
        sendMail(toEmail, subject, text);
    }

    /**
     * General method for sending emails
     */
    private void sendMail(String to, String subject, String text) {
        try {
            // 1. Create the email object
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // 2. Set sender, recipient, subject, and content
            helper.setFrom("yourgmailEmail@gmail.com"); // Must match spring.mail.username
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, false);

            // 3. Send the email
            mailSender.send(message);
            log.info("Email sent successfully: to={}, subject={}", to, subject);

        } catch (MessagingException e) {
            // Only catch javax.mail.MessagingException
            log.error("Failed to send email: to={}, subject={}, error={}", to, subject, e.getMessage());
            // Optionally, throw a RuntimeException or handle it differently if needed
        }
    }


    @Async("mailAsyncExecutor")
    @Override
    public void sendResetLink(String toEmail, String resetLink) {
        String subject = "Fitness App - Password Reset Link";
        String text = "Hello,\n\nPlease click the following link to reset your password:\n" +
                resetLink + "\n\nThe link is valid for 5 minutes.\n" +
                "If you did not request a password reset, please ignore this email.";
        sendMail(toEmail, subject, text);
    }

}

