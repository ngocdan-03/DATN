package com.NgocDan.BACKEND.dto.response;

import java.math.BigDecimal;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FinanceSummaryResponse {
    // bọc danh sách giao dịch trong page response
    PageResponse<TransactionResponse> transactions;

    // Thống kê theo tháng (6 tháng gần nhất)
    List<MonthlyChartResponse> chartData;

    // tổng nạp và chi trong 6 tháng
    BigDecimal totalDeposit6Months;
    BigDecimal totalSpend6Months;
}
