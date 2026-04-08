package com.NgocDan.BACKEND.controller;

import com.NgocDan.BACKEND.dto.response.ApiResponse;
import com.NgocDan.BACKEND.dto.response.DashboardOverviewResponse;
import com.NgocDan.BACKEND.service.DashboardService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DashboardController {
    DashboardService dashboardService;
    @GetMapping("/overview")
    @PreAuthorize("hasAuthority('GET_OVERVIEW')")
    public ApiResponse<DashboardOverviewResponse> getOverview() {
        return ApiResponse.<DashboardOverviewResponse>builder()
                .code(1000)
                .message("Lấy thông tin tổng quan thành công!")
                .result(dashboardService.getOverview())
                .build();
    }
}
