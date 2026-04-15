package com.NgocDan.BACKEND.configuration;

import jakarta.annotation.PostConstruct;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class StreamInitializer {
    private final RedisTemplate<String, Object> redisTemplate;

    @PostConstruct
    public void init() {
        try {
            // kiểm tra và tạo group tên "otp_email_group" cho stream "otp_email_stream"
            redisTemplate.opsForStream().createGroup(
                    RedisConfig.EMAIL_STREAM_KEY,
                    RedisConfig.EMAIL_CONSUMER_GROUP
            );
            log.info("da tao thanh cong consumer group cho email stream");
        } catch (Exception e) {
            log.info("consumer group da ton tai, khong can tao moi");
        }
    }
}
