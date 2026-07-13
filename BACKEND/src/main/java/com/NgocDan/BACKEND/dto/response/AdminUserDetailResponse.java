package com.NgocDan.BACKEND.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdminUserDetailResponse {
    Long id;
    String fullName;
    String email;
    String phone;
    String avatarUrl;
    BigDecimal balance;
    Boolean isVerified;
    Boolean isLocked;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    // Thống kê bài đăng
    Long totalPosts;
    Long approvedPosts;
    Long pendingPosts;
    Long rejectedPosts;

    // Lịch sử giao dịch gần đây
    PageResponse<TransactionResponse> recentTransactions;
}
