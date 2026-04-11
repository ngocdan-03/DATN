package com.NgocDan.BACKEND.dto.response;

import java.math.BigDecimal;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentCallbackResponse {
    String status; // "Success" hoặc "Failed"
    String message; // Tin nhắn lấy từ Enum
    BigDecimal amount; // Số tiền (VND)
    String txnRef; // Mã GD của hệ thống
}
