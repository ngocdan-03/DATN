package com.NgocDan.BACKEND.dto.response;

import java.math.BigDecimal;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TransactionDetailResponse {
    Long id;
    String invoiceNo; // Mã hóa đơn (Ví dụ: INV-102)

    // Thông tin khách hàng (Lấy từ Entity User)
    String customerName;
    String customerEmail;
    String customerPhone;

    // Thông tin giao dịch
    BigDecimal amount;
    String type;
    String status;
    String description;
    String transactionDate; // dd/MM/yyyy HH:mm:ss

    // Thông tin VNPay
    String vnpTxnRef;
    String vnpTransactionNo;

    // Thông tin bài đăng (Nếu là phí đăng tin)
    Long postId;
    String postTitle;
}
