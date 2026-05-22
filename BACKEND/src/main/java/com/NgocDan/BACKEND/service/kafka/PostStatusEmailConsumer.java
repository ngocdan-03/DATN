package com.NgocDan.BACKEND.service.kafka;

import com.NgocDan.BACKEND.model.kafka.PostStatusEmailEvent;
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
public class PostStatusEmailConsumer {

    EmailService emailService;

    @KafkaListener(topics = "post_status_email_topic", groupId = "real-estate-group")
    public void listen(PostStatusEmailEvent payload) {
        log.info("[Kafka] Nhan yeu cau gui mail trang thai bai dang cho: {}", payload.getEmail());
        try {
            emailService.sendPostStatusEmail(payload);
        } catch (Exception e) {
            log.error("[Kafka] Loi khi gui mail trang thai bai dang: {}", e.getMessage());
        }
    }
}