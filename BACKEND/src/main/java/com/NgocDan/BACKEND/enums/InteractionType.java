package com.NgocDan.BACKEND.enums;

import lombok.Getter;

@Getter
public enum InteractionType {
    // Người dùng click vào xem chi tiết bài đăng
    VIEW,
    // Người dùng nhấn "Lưu"
    SAVE,
    // Người dùng nhấn "Liên hệ"
    CONTACT
}
