package com.NgocDan.BACKEND.controller;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.NgocDan.BACKEND.dto.request.PaymentRequest;
import com.NgocDan.BACKEND.dto.response.ApiResponse;
import com.NgocDan.BACKEND.dto.response.PaymentCallbackResponse;
import com.NgocDan.BACKEND.dto.response.PaymentResponse;
import com.NgocDan.BACKEND.service.VNPayService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {
    VNPayService vnPayService;

    // Endpoint để tạo URL thanh toán với VNPay
    @PostMapping("/create-vnpay-url")
    @PreAuthorize("hasAuthority('PAYMENT_CREATE')")
    public ApiResponse<PaymentResponse> createPayment(
            @RequestBody @Valid PaymentRequest paymentRequest, HttpServletRequest request) {
        return ApiResponse.<PaymentResponse>builder()
                .code(1000)
                .message("tạo url thanh toán thành công")
                .result(vnPayService.createPaymentUrl(paymentRequest, request))
                .build();
    }

    // Endpoint callback sau khi thanh toán VNPay hoàn tất
    @GetMapping("/vnpay-callback")
    public void paymentCallback(@RequestParam Map<String, String> queryParams, HttpServletResponse response)
            throws IOException {
        PaymentCallbackResponse result = vnPayService.processCallback(queryParams);

        // Điều hướng
        String redirectUrl = String.format(
                "http://localhost:5173/payment/result?status=%s&amount=%s&message=%s",
                result.getStatus(), result.getAmount(), URLEncoder.encode(result.getMessage(), StandardCharsets.UTF_8));

        response.sendRedirect(redirectUrl);
    }

    // Endpoint để ipn tuuwf vnpay (gọi ngầm )
    @GetMapping("/vnpay-ipn")
    public Map<String, String> paymentIpn(@RequestParam Map<String, String> queryParams) {
        return vnPayService.processIPN(queryParams);
    }
}
