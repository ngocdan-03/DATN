package com.NgocDan.BACKEND.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DashboardOverviewResponse {
    // sô dư, số bài đăng đang hoạt động và toongr số lượt xem
    BigDecimal balance; // số dư hiện tại
    long livePostsCount; // số bài đăng đang hoạt động
    long totalViews; // tổng số lượt xem

    // Biểu đồ xu hướng 7 ngày
    List<ViewTrendPoint> viewTrend;

    // Biểu đồ tròn trạng thái
    List<StatusCount> statusDistribution;

    @Data @AllArgsConstructor
    public static class ViewTrendPoint {
        String label; // Định dạng "dd/MM"
        long value;
    }

    @Data @AllArgsConstructor
    public static class StatusCount {
        String status;
        long count;
    }

}
