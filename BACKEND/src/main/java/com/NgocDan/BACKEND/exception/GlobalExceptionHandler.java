package com.NgocDan.BACKEND.exception;

import java.util.Map;
import java.util.Objects;

import jakarta.validation.ConstraintViolationException;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.NgocDan.BACKEND.dto.response.ApiResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final String MIN_ATTRIBUTE = "min";

    // 1. Lỗi không xác định (Hệ thống)
    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse<?>> handlingException(Exception exception) {
        log.error("Hệ thống có lỗi chưa xác định: ", exception);
        return ResponseEntity.status(ErrorCode.UNCATEGORIZED_EXCEPTION.getStatusCode())
                .body(ApiResponse.builder()
                        .code(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode())
                        .message(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage())
                        .build());
    }

    // 2. Lỗi Business Logic
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<?>> handlingAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        return ResponseEntity.status(errorCode.getStatusCode())
                .body(ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build());
    }

    // 3. Lỗi Phân quyền (Access Denied)
    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse<?>> handlingAccessDeniedException(AccessDeniedException exception) {
        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
        return ResponseEntity.status(errorCode.getStatusCode())
                .body(ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build());
    }

    // 4. Lỗi Validation cho DTO (@RequestBody @Valid)
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<?>> handlingValidation(MethodArgumentNotValidException exception) {
        // 1. Kiểm tra Field Error trước, nếu không có thì lấy Global Error
        var fieldError = exception.getFieldError();
        var globalError = exception.getGlobalError();

        String enumKey = (fieldError != null) ? fieldError.getDefaultMessage()
                : (globalError != null ? globalError.getDefaultMessage() : "INVALID_INPUT");

        ErrorCode errorCode = ErrorCode.INVALID_INPUT;
        Map<String, Object> attributes = null;

        try {
            errorCode = ErrorCode.valueOf(enumKey);

            // 2. Lấy attributes (min, max, message...) để map vào message động
            // Chỗ này mình lấy error đầu tiên bất kể là field hay global
            var error = exception.getBindingResult().getAllErrors().get(0);
            var constraintViolation = error.unwrap(jakarta.validation.ConstraintViolation.class);
            attributes = constraintViolation.getConstraintDescriptor().getAttributes();

        } catch (IllegalArgumentException e) {
            log.error("Key lỗi Validation chưa được định nghĩa trong ErrorCode: {}", enumKey);
        } catch (Exception e) {
            log.warn("Không thể lấy attributes từ ConstraintViolation cho key: {}", enumKey);
        }

        return ResponseEntity.status(errorCode.getStatusCode())
                .body(ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(Objects.nonNull(attributes)
                                ? mapAttribute(errorCode.getMessage(), attributes)
                                : errorCode.getMessage())
                        .build());
    }

    // 5. Lỗi Validation cho Param/PathVariable (@Validated trên Class)
    @ExceptionHandler(value = ConstraintViolationException.class)
    ResponseEntity<ApiResponse<?>> handlingConstraintViolationException(ConstraintViolationException exception) {
        // Lấy message lỗi đầu tiên
        String message = exception.getConstraintViolations().iterator().next().getMessage();

        ErrorCode errorCode = ErrorCode.INVALID_INPUT;
        try {
            errorCode = ErrorCode.valueOf(message);
        } catch (IllegalArgumentException e) {
            // Fallback nếu không map được enum
        }

        return ResponseEntity.status(errorCode.getStatusCode())
                .body(ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build());
    }

    // 6. Lỗi format dữ liệu đầu vào (Ví dụ: JSON parse lỗi, LocalDate format sai...)
    @ExceptionHandler(value = org.springframework.http.converter.HttpMessageNotReadableException.class)
    ResponseEntity<ApiResponse<?>> handlingHttpMessageNotReadableException(
            org.springframework.http.converter.HttpMessageNotReadableException exception) {

        ErrorCode errorCode = ErrorCode.FORMAT_INVALID; // Mặc định

        // Kiểm tra xem nguyên nhân có phải do Jackson không parse được format hay không
        if (exception.getCause() instanceof com.fasterxml.jackson.databind.exc.InvalidFormatException invalidFormatEx) {

            // Nếu đích đến là kiểu LocalDate, ta khẳng định là lỗi format ngày tháng
            if (invalidFormatEx.getTargetType().equals(java.time.LocalDate.class)) {
                errorCode = ErrorCode.INVALID_DATE_FORMAT;
            }
        }

        return ResponseEntity.status(errorCode.getStatusCode())
                .body(ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build());
    }

    // Hàm bổ trợ để thay thế các placeholder như {min} trong message
    private String mapAttribute(String message, Map<String, Object> attributes) {
        String minValue = String.valueOf(attributes.get(MIN_ATTRIBUTE));
        return message.replace("{" + MIN_ATTRIBUTE + "}", minValue);
    }
}