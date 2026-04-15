package com.NgocDan.BACKEND.service.redis;

import java.time.Duration;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostRedisService {

    RedisTemplate<String, Object> redisTemplate;

    public boolean checkAndSetPostCooldown(Long userId, long seconds) {
        String key = "post:cooldown:" + userId;

        Boolean success = redisTemplate.opsForValue()
                .setIfAbsent(key, "locked", Duration.ofSeconds(seconds));

        return Boolean.TRUE.equals(success);
    }
}