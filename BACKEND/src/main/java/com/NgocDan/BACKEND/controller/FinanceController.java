package com.NgocDan.BACKEND.controller;

import com.NgocDan.BACKEND.dto.response.ApiResponse;
import com.NgocDan.BACKEND.dto.response.DashboardOverviewResponse;
import com.NgocDan.BACKEND.dto.response.FinanceSummaryResponse;
import com.NgocDan.BACKEND.dto.response.TransactionDetailResponse;
import com.NgocDan.BACKEND.service.DashboardService;
import com.NgocDan.BACKEND.service.FinanceService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/finance")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FinanceController {
    FinanceService financeService;
    @GetMapping("/summary")
    @PreAuthorize("hasAuthority('VIEW_MY_FINANCE')")
    public ApiResponse<FinanceSummaryResponse> getFinanceSummary(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size,
            @RequestParam(value = "keyword", required = false) String keyword
    ) {
        return ApiResponse.<FinanceSummaryResponse>builder()
                .code(1000)
                .message("Lấy thông tin tài chính thành công!")
                .result(financeService.getFinanceSummary(page, size, keyword))
                .build();
    }

    @GetMapping("/transactions/{id}")
    @PreAuthorize("hasAuthority('VIEW_DETAIL_MY_FINANCE')")
    public ApiResponse<TransactionDetailResponse> getTransactionDetail(@PathVariable Long id) {
        return ApiResponse.<TransactionDetailResponse>builder()
                .code(1000)
                .message("Lấy chi tiết giao dịch thành công!")
                .result(financeService.getTransactionDetail(id))
                .build();
    }
}
