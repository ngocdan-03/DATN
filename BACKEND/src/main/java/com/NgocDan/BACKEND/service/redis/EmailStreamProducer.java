package com.NgocDan.BACKEND.service.redis;

import org.springframework.data.redis.connection.stream.RecordId;
import org.springframework.data.redis.connection.stream.StreamRecords;
import org.springframework.data.redis.connection.stream.StringRecord;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.NgocDan.BACKEND.configuration.RedisConfig;
import com.NgocDan.BACKEND.model.redis.OtpEmail;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailStreamProducer {

    RedisTemplate<String, Object> redisTemplate;

    ObjectMapper objectMapper;

    public void publishOtpEmail(OtpEmail otpEmail) {
        try {
            String emailJson = objectMapper.writeValueAsString(otpEmail);

            log.info("Chuoi json chuan bi day vao redis: {}", emailJson);

            StringRecord record = StreamRecords.newRecord()
                    .in(RedisConfig.EMAIL_STREAM_KEY)
                    .ofStrings(Collections.singletonMap("payload", emailJson))
                    .withId(RecordId.autoGenerate());

            RecordId recordId = redisTemplate.opsForStream().add(record);
            log.info("Da day yeu cau gui mail cho {} vao Redis Stream. ID: {}", otpEmail.getEmail(), recordId);

        } catch (Exception e) {
            log.error("Loi khi dong goi JSON: {}", e.getMessage());
        }
    }
}