package com.NgocDan.BACKEND.configuration;

import com.NgocDan.BACKEND.dto.response.ApiResponse;
import com.NgocDan.BACKEND.exception.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        // Mặc định là lỗi chưa xác thực (2001)
        ErrorCode errorCode = ErrorCode.UNAUTHENTICATED;

        // Lấy nguyên nhân thực sự từ Decoder ném ra
        Throwable cause = authException.getCause();

        if (cause != null) {
            String message = cause.getMessage();
            log.warn("Auth failure cause: {}", message);

            if (message.contains("Jwt expired")) {
                errorCode = ErrorCode.INVALID_TOKEN; // 2004
            } else if (message.equals("TOKEN_REVOKED")) {
                errorCode = ErrorCode.TOKEN_REUSE_DETECTED; // 2005
            } else if (message.equals("USER_LOCKED")) {
                errorCode = ErrorCode.USER_LOCKED; // 2006
            } else if (message.equals("USER_NOT_VERIFIED")) {
                errorCode = ErrorCode.USER_NOT_VERIFIED; // 1012
            } else if (message.equals("USER_NOT_EXISTED")) {
                errorCode = ErrorCode.USER_NOT_EXISTED; // 1009
            }
        }

        response.setStatus(errorCode.getStatusCode().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();

        ObjectMapper objectMapper = new ObjectMapper();
        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
        response.flushBuffer();
    }
}