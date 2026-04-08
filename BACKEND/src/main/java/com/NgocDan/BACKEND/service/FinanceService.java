package com.NgocDan.BACKEND.service;

import com.NgocDan.BACKEND.dto.response.*;
import com.NgocDan.BACKEND.exception.AppException;
import com.NgocDan.BACKEND.exception.ErrorCode;
import com.NgocDan.BACKEND.mapper.TransactionMapper;
import com.NgocDan.BACKEND.model.Transaction;
import com.NgocDan.BACKEND.repository.TransactionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FinanceService {
    TransactionRepository transactionRepository;
    TransactionMapper transactionMapper;

    public FinanceSummaryResponse getFinanceSummary(int page, int size, String keyword) {
        String sub = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(sub);

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<Transaction> pageData;

        // 1. Kiểm tra nếu có keyword thì tìm kiếm, không thì lấy tất cả
        if (keyword != null && !keyword.trim().isEmpty()) {
            log.info("Tìm kiếm giao dịch với từ khóa: {}", keyword);
            pageData = transactionRepository.findByUserIdAndDescriptionContainingIgnoreCase(userId, keyword, pageable);
        } else {
            pageData = transactionRepository.findByUserId(userId, pageable);
        }

        // 2. Map dữ liệu sang DTO và Build PageResponse
        var listTransactions = pageData.getContent().stream()
                .map(transactionMapper::toTransactionResponse)
                .toList();

        PageResponse<TransactionResponse> transactionsPageResponse = PageResponse.<TransactionResponse>builder()
                .currentPage(page)
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .pageSize(pageData.getSize())
                .data(listTransactions)
                .build();

        // 3. Xử lý Biểu đồ và Tổng tiền (Chỉ làm ở trang 1 và khi KHÔNG tìm kiếm)
        List<MonthlyChartResponse> chartData = new ArrayList<>();
        BigDecimal totalDeposit = BigDecimal.ZERO;
        BigDecimal totalSpend = BigDecimal.ZERO;

        if (page == 1 && (keyword == null || keyword.isEmpty())) {
            List<Object[]> rawStats = transactionRepository.getRawMonthlyStats(userId);
            chartData = fillMissingMonths(rawStats);
            totalDeposit = chartData.stream().map(MonthlyChartResponse::getTotalDeposit).reduce(BigDecimal.ZERO, BigDecimal::add);
            totalSpend = chartData.stream().map(MonthlyChartResponse::getTotalSpend).reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        return FinanceSummaryResponse.builder()
                .transactions(transactionsPageResponse)
                .chartData(chartData)
                .totalDeposit6Months(totalDeposit)
                .totalSpend6Months(totalSpend)
                .build();
    }

    // hàm bổ trợ để lấy kết quả 6 tháng gần nhất, đảm bảo có đủ 6 tháng dù không có giao dịch nào
    private List<MonthlyChartResponse> fillMissingMonths(List<Object[]> rawstats) {
        Map<String, MonthlyChartResponse> statsMap = new HashMap<>();

        // đổ dữ liệu thô vào map để dễ truy cập
        for (Object[] row : rawstats) {
            String label = row[0].toString(); // định dạng "MM-yyyy"
            statsMap.put(label, MonthlyChartResponse.builder()
                    .lable(label)
                    .totalDeposit((BigDecimal) row[1])
                    .totalSpend((BigDecimal) row[2])
                    .build());
        }

        List<MonthlyChartResponse> filledData = new ArrayList<>();
        LocalDate now = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/yyyy");

        // tạo 6 tháng gần nhất
        for (int i = 5; i >= 0; i--) {
            String monthLabel = now.minusMonths(i).format(formatter);

            // nếu không có dữ liệu cho tháng này, tạo bản ghi với 0
            MonthlyChartResponse mothData = statsMap.getOrDefault(monthLabel, MonthlyChartResponse.builder()
                    .lable(monthLabel)
                    .totalDeposit(BigDecimal.ZERO)
                    .totalSpend(BigDecimal.ZERO)
                    .build());
            filledData.add(mothData);
        }
        return filledData;
    }

    // hàm lấy chi tiết giao dịch
    public TransactionDetailResponse getTransactionDetail(Long id) {
        // lấy id từ Security Context
        String sub = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(sub);

        // tìm giao dịch theo id
        Transaction transaction = transactionRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new AppException(ErrorCode.TRANSACTION_NOT_EXISTED));

        // kiểm tra giao dịch có thuộc về user hay không
        if (!transaction.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // map sang DTO và trả về
        return transactionMapper.toDetailResponse(transaction);
    }
}