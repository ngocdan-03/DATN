package com.NgocDan.BACKEND.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class AdminDashboardResponse {

    // tổng quan
    long totalUsers;
    long totalPosts;
    long pendingPosts;
    BigDecimal totalRevenue; // tổng doanh thu từ phí đăng tin từ trước đến nay
    BigDecimal revenueThisMonth; // doanh thu trong tháng này

    // phân bố bài đăng theo status
    long approvedPosts;
    long rejectedPosts;
    long deletedPosts;

    // biểu đồ doanh thu 12 tháng trong năm
    List<MonthlyRevenueResponse> monthlyRevenue;

    // người dùng mới
    long newUsersThisMonth; // số người dùng mới trong tháng này

}
