package com.NgocDan.BACKEND.enums;

import lombok.Getter;

@Getter
public enum TransactionStatus {
    // Đang tạo
    PENDING,
    // Đã hoàn thành
    SUCCESS,
    // Đã hủy
    FAILED
}
