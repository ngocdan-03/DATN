package com.NgocDan.BACKEND.service.redis;

import com.NgocDan.BACKEND.model.redis.RefreshToken;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RefreshTokenRedisService {
    RedisTemplate<String, Object> redisTemplate;

    String RT_PREFIX = "datn:rt:";
    String FAMILY_PREFIX = "datn:family:";

    public void save(RefreshToken token, long ttl) {
        String key = RT_PREFIX + token.getId();
        String familyKey = FAMILY_PREFIX + token.getFamilyId();

        // Lưu Refresh Token
        redisTemplate.opsForValue().set(key, token, Duration.ofSeconds(ttl));

        // Quản lý gia đình Token để Reuse Detection
        redisTemplate.opsForSet().add(familyKey, token.getId());
        redisTemplate.expire(familyKey, Duration.ofSeconds(ttl));
    }

    public RefreshToken findById(String jti) {
        return (RefreshToken) redisTemplate.opsForValue().get(RT_PREFIX + jti);
    }

    public void delete(String jti) {
        redisTemplate.delete(RT_PREFIX + jti);
    }

    public void deleteFamily(String familyId) {
        String familyKey = FAMILY_PREFIX + familyId;
        Set<Object> jtis = redisTemplate.opsForSet().members(familyKey);

        if (jtis != null) {
            Set<String> keysToDelete = jtis.stream()
                    .map(jti -> RT_PREFIX + jti)
                    .collect(Collectors.toSet());
            keysToDelete.add(familyKey);
            redisTemplate.delete(keysToDelete);
        }
    }
}