package com.NgocDan.BACKEND.service.kafka;

import com.NgocDan.BACKEND.model.redis.OtpEmail;
import com.NgocDan.BACKEND.service.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class EmailKafkaConsumer {

    EmailService emailService;

    @KafkaListener(topics = "otp_email_topic", groupId = "real-estate-group")
    public void listen(OtpEmail payload) {
        log.info("[Kafka] Nhan yeu cau gui mail OTP cho: {}", payload.getEmail());
        try {
            emailService.sendOtpEmail(payload);
        } catch (Exception e) {
            log.error("[Kafka] Loi khi gui mail: {}", e.getMessage());
        }
    }
}