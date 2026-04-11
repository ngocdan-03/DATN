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
public class InteractionRedisService {
    RedisTemplate<String, Object> redisTemplate;

    // Tạo key theo định dạng: view:userId:postId
    private String getViewKey(Long userId, Long postId) {
        return "view:" + userId + ":" + postId;
    }

    // Kiểm tra xem User đã xem bài này trong vòng 24h chưa
    public boolean hasViewed(Long userId, Long postId) {
        String key = getViewKey(userId, postId);
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    // Đánh dấu đã xem và set TTL (ví dụ 24 giờ)
    public void markAsViewed(Long userId, Long postId, long hours) {
        String key = getViewKey(userId, postId);
        redisTemplate.opsForValue().set(key, "viewed", Duration.ofHours(hours));
    }
}
