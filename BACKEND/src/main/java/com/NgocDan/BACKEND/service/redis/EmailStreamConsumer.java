package com.NgocDan.BACKEND.service.redis;

import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.stream.StreamListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.NgocDan.BACKEND.configuration.RedisConfig;
import com.NgocDan.BACKEND.model.redis.OtpEmail;
import com.NgocDan.BACKEND.service.EmailService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailStreamConsumer implements StreamListener<String, MapRecord<String, String, String>> {

    EmailService emailService;
    RedisTemplate<String, Object> redisTemplate;

    ObjectMapper objectMapper;

    @Override
    public void onMessage(MapRecord<String, String, String> message) {
        try {
            String emailJson = message.getValue().get("payload");

            if (emailJson != null && emailJson.startsWith("\"") && emailJson.endsWith("\"")) {
                emailJson = emailJson.substring(1, emailJson.length() - 1)
                        .replace("\\\"", "\"");
            }

            log.info("Chuoi JSON Consumer keo ra duoc: {}", emailJson);

            OtpEmail otpEmail = objectMapper.readValue(emailJson, OtpEmail.class);

            log.info("Bat dau xu ly gui mail tu Stream cho: {}", otpEmail.getEmail());

            emailService.sendOtpEmail(otpEmail);

            redisTemplate.opsForStream().acknowledge(RedisConfig.EMAIL_CONSUMER_GROUP, message);
            redisTemplate.opsForStream().delete(message);

            log.info("Da gui xong va ACK message: {}", message.getId());

        } catch (Exception e) {
            log.error("Loi khi xu ly Stream: {}", e.getMessage(), e);
        }
    }
}