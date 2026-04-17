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

    private String getInteractionKey(Long userId, Long postId, String interactionType) {
        return "interaction:" + interactionType + ":" + userId + ":" + postId;
    }

    public boolean isAllowedToInteract(Long userId, Long postId, String interactionType, long hours) {
        String key = getInteractionKey(userId, postId, interactionType);

        Boolean success = redisTemplate.opsForValue().setIfAbsent(key, "locked", Duration.ofHours(hours));

        return Boolean.TRUE.equals(success);
    }
}
