package com.NgocDan.BACKEND.service.redis;

import java.time.Duration;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.NgocDan.BACKEND.model.redis.OtpEmail;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OtpRedisService {
    RedisTemplate<String, Object> redisTemplate;

    public void save(OtpEmail otpEmail, long ttl) {
        String key = "otp:" + otpEmail.getPurpose() + ":" + otpEmail.getEmail();
        // Lưu mã OTP với TTL từ Model (đã chuyển sang giây cho đồng bộ)
        redisTemplate.opsForValue().set(key, otpEmail.getOtp(), Duration.ofSeconds(ttl));
    }

    public String getOtp(String email, String purpose) {
        String key = "otp:" + purpose + ":" + email;
        return (String) redisTemplate.opsForValue().get(key);
    }

    public void deleteOtp(String email, String purpose) {
        redisTemplate.delete("otp:" + purpose + ":" + email);
    }

    public boolean checkAndSetCooldown(String email, String purpose, long seconds) {
        String key = "otp:cooldown:" + purpose + ":" + email;

        // setIfAbsent: Nếu chưa có key thì tạo key với TTL và trả về true. Nếu đã có thì trả về false.
        Boolean success = redisTemplate.opsForValue().setIfAbsent(key, "locked", Duration.ofSeconds(seconds));

        return Boolean.TRUE.equals(success);
    }
}
