package com.NgocDan.BACKEND.enums;

import lombok.Getter;

@Getter
public enum TransactionType {
    // Nạp tiền vào ví
    DEPOSIT,
    // Trừ tiền khi đăng tin
    POST_FEE,
    // Hoàn tiền
    REFUND
}
