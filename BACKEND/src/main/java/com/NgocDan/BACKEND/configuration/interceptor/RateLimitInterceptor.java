package com.NgocDan.BACKEND.configuration.interceptor;

import java.time.Duration;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.NgocDan.BACKEND.exception.AppException;
import com.NgocDan.BACKEND.exception.ErrorCode;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RateLimitInterceptor implements HandlerInterceptor {

    StringRedisTemplate stringRedisTemplate;

    // CẤU HÌNH GLOBAL: Tối đa 5 request / 1 giây cho mỗi IP
    static int MAX_REQUESTS = 5;
    static int TIME_WINDOW_SECONDS = 1;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String clientIp = getClientIp(request);

        // Tạo Key đếm số trong Redis
        String key = "rate_limit:ip:" + clientIp;

        // Tăng bộ đếm lên 1 (Atomic)
        Long currentRequests = stringRedisTemplate.opsForValue().increment(key);

        // Nếu là lượt truy cập đầu tiên, đặt đồng hồ đếm ngược theo GIÂY
        if (currentRequests != null && currentRequests == 1) {
            stringRedisTemplate.expire(key, Duration.ofSeconds(TIME_WINDOW_SECONDS));
        }

        // Nếu quá giới hạn -> Chặn đứng
        if (currentRequests != null && currentRequests > MAX_REQUESTS) {
            log.warn("IP {} thao tác quá nhanh (Spam). Đã block!", clientIp);
            throw new AppException(ErrorCode.TOO_MANY_REQUESTS);
        }

        return true;
    }

    // Lấy IP thật của khách hàng
    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}