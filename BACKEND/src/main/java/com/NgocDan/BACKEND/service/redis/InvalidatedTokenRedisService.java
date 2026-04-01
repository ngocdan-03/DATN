package com.NgocDan.BACKEND.service.redis;

import com.NgocDan.BACKEND.model.redis.InvalidatedToken;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InvalidatedTokenRedisService {
    RedisTemplate<String, Object> redisTemplate;

    String BLACKLIST_PREFIX = "datn:blacklist:";

    public void save(InvalidatedToken token, long ttl) {
        String key = BLACKLIST_PREFIX + token.getId();
        redisTemplate.opsForValue().set(
                key,
                token,
                Duration.ofSeconds(ttl)
        );
    }

    public boolean isExists(String jti) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(BLACKLIST_PREFIX + jti));
    }
}