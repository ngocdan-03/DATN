package com.NgocDan.BACKEND.dto.response;

import java.math.BigDecimal;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MonthlyChartResponse {
    String lable; // tháng năm(11/2003)
    BigDecimal totalDeposit; // tổng nạp
    BigDecimal totalSpend; // tổng chi
}
