package com.NgocDan.BACKEND.enums;

import lombok.Getter;

@Getter
public enum PostStatus {
    // Đang chờ duyệt
    PENDING,
    // Đã duyệt
    APPROVED,
    // tin đã xóa
    DELETED,
    // tin bị từ chối
    REJECTED
}
