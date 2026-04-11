package com.NgocDan.BACKEND.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.NgocDan.BACKEND.dto.response.DashboardOverviewResponse;
import com.NgocDan.BACKEND.enums.PostStatus;
import com.NgocDan.BACKEND.exception.AppException;
import com.NgocDan.BACKEND.exception.ErrorCode;
import com.NgocDan.BACKEND.model.User;
import com.NgocDan.BACKEND.repository.PostRepository;
import com.NgocDan.BACKEND.repository.UserInteractionRepository;
import com.NgocDan.BACKEND.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DashboardService {
    PostRepository postRepository;
    UserRepository userRepository;
    UserInteractionRepository userInteractionRepository;

    @Transactional(readOnly = true)
    public DashboardOverviewResponse getOverview() {
        // lấy id từ Security Context
        String sub = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(sub);

        // lấy user
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // lấy bài viết đang sống và tổng views
        long livePosts = postRepository.countByUserIdAndStatus(userId, PostStatus.APPROVED);
        long totalViews = userInteractionRepository.countTotalViewsByOwner(userId);

        // lấy dữ liệu biểu đồ tròn
        List<DashboardOverviewResponse.StatusCount> statusDist = postRepository.countStatusDistribution(userId).stream()
                .map(obj -> new DashboardOverviewResponse.StatusCount(obj[0].toString(), (Long) obj[1]))
                .toList();

        // lấy dữ liệu lượt xem 7 ngày gần nhất
        LocalDateTime startDate = LocalDateTime.now().minusDays(6).withHour(0).withMinute(0);
        List<Object[]> rawTrend = userInteractionRepository.getViewTrendRaw(userId, startDate);

        // map kết quả theo ngày
        Map<String, Long> trendMap =
                rawTrend.stream().collect(Collectors.toMap(obj -> (obj[0]).toString(), obj -> (Long) obj[1]));

        // tạo list 7 ngày gần nhất
        List<DashboardOverviewResponse.ViewTrendPoint> finalTrend = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");
        DateTimeFormatter keyFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        for (int i = 6; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            String key = date.format(keyFormatter);
            String label = date.format(formatter);
            long count = trendMap.getOrDefault(key, 0L);
            finalTrend.add(new DashboardOverviewResponse.ViewTrendPoint(label, count));
        }

        return DashboardOverviewResponse.builder()
                .balance(user.getBalance())
                .livePostsCount(livePosts)
                .totalViews(totalViews)
                .statusDistribution(statusDist)
                .viewTrend(finalTrend)
                .build();
    }
}
