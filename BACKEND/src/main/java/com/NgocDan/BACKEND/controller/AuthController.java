package com.NgocDan.BACKEND.controller;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.NgocDan.BACKEND.dto.request.*;
import com.NgocDan.BACKEND.dto.response.ApiResponse;
import com.NgocDan.BACKEND.dto.response.LoginResponse;
import com.NgocDan.BACKEND.dto.response.RefreshResponse;
import com.NgocDan.BACKEND.service.AuthService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {
    AuthService authService;

    @PostMapping("/register")
    ApiResponse<Void> register(@RequestBody @Valid UserRegisterRequest request) {
        authService.register(request);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Đăng ký thành công! vui lòng xác thực tài khoản để sử dụng.")
                .build();
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        var result = authService.login(request);
        return ApiResponse.<LoginResponse>builder()
                .code(1000)
                .message("Đăng nhập thành công!")
                .result(result)
                .build();
    }

    @PostMapping("/refresh")
    public ApiResponse<RefreshResponse> refresh(@RequestBody @Valid RefreshRequest request) {
        var result = authService.refreshToken(request);
        return ApiResponse.<RefreshResponse>builder()
                .code(1000)
                .message("Làm mới token thành công!")
                .result(result)
                .build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) {
        authService.logout(request);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Logged out successfully")
                .build();
    }

    @PostMapping("/send-otp-verify")
    ApiResponse<Void> sendOtpVerify(@RequestBody @Valid EmailRequest request) {
        authService.sendOtp(request.getEmail(), "verify");
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Mã xác thực đã được gửi tới email của bạn.")
                .build();
    }

    @PostMapping("/verify-account")
    ApiResponse<Void> verifyAccount(@RequestBody @Valid VerifyAccountRequest request) {
        authService.verifyAccount(request);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Tài khoản đã được xác thực thành công!")
                .build();
    }

    @PostMapping("/forgot-password")
    ApiResponse<Void> forgotPassword(@RequestBody @Valid EmailRequest request) {
        authService.sendOtp(request.getEmail(), "forgot");
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Mã xác thực đã được gửi tới email của bạn.")
                .build();
    }

    @PostMapping("/reset-password")
    ApiResponse<Void> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Mật khẩu đã được thay đổi thành công.")
                .build();
    }

    @PostMapping("/resend-otp")
    ApiResponse<Void> resendOtp(@RequestBody @Valid OtpRequest request) {
        authService.sendOtp(request.getEmail(), request.getPurpose());
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Mã OTP mới đã được gửi.")
                .build();
    }
}
