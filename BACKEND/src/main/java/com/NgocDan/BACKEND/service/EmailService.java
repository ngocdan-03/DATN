package com.NgocDan.BACKEND.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.NgocDan.BACKEND.exception.AppException;
import com.NgocDan.BACKEND.exception.ErrorCode;
import com.NgocDan.BACKEND.model.redis.OtpEmail;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {
    JavaMailSender mailSender;

    public void sendOtpEmail(OtpEmail otpEmail) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Lấy dữ liệu từ đối tượng otpEmail
            helper.setTo(otpEmail.getEmail());
            helper.setSubject(otpEmail.getPurpose().equals("verify") ? "Xác nhận tài khoản" : "Khôi phục mật khẩu");

            String content = "<h3>Mã xác nhận của bạn là: <b style='color: blue;'>" + otpEmail.getOtp() + "</b></h3>"
                    + "<p>Mã này có hiệu lực trong vài phút. Vui lòng không cung cấp mã này cho bất kỳ ai.</p>";

            helper.setText(content, true);
            mailSender.send(message);

            log.info("Email da duoc gui toi: {}", otpEmail.getEmail());
        } catch (MessagingException e) {
            log.error("Loi khi gui email toi {}: {}", otpEmail.getEmail(), e.getMessage());
            throw new AppException(ErrorCode.EMAIL_SEND_FAILED);
        }
    }
}
