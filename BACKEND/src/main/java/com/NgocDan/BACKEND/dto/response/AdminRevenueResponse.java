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
public class AdminRevenueResponse {
    // Doanh thu theo các mốc thời gian
    BigDecimal totalRevenue;
    BigDecimal revenueToday;
    BigDecimal revenueThisMonth;
    BigDecimal revenueThisYear;

    // Thống kê giao dịch
    long totalTransactions;
    long totalDeposits;
    long totalPostFees;

    // Biểu đồ 12 tháng
    List<MonthlyRevenueResponse> monthlyRevenue;
}
