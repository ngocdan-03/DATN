package com.NgocDan.BACKEND.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.NgocDan.BACKEND.model.Transaction;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByVnpTxnRef(String vnpTxnRef);

    // lấy danh sách theo trang
    Page<Transaction> findByUserId(Long userId, Pageable pageable);
    // Tìm kiếm giao dịch của User theo keyword trong description
    Page<Transaction> findByUserIdAndDescriptionContainingIgnoreCase(Long userId, String keyword, Pageable pageable);

    // thống kê theo tháng (6 tháng gần nhất)
    @Query(value = "SELECT " +
            "  DATE_FORMAT(created_at, '%m/%Y') as month_year, " +
            "  SUM(CASE WHEN type IN ('DEPOSIT', 'REFUND') THEN amount ELSE 0 END) as total_deposit, " +
            "  SUM(CASE WHEN type = 'POST_FEE' THEN amount ELSE 0 END) as total_spend " +
            "FROM transactions " +
            "WHERE user_id = :userId AND status = 'SUCCESS' " +
            "  AND created_at >= DATE_FORMAT(CURDATE() - INTERVAL 5 MONTH, '%Y-%m-01') " + // Chỗ này đã sửa
            "GROUP BY month_year " +
            "ORDER BY MIN(created_at) ASC",
            nativeQuery = true)
    List<Object[]> getRawMonthlyStats(@Param("userId") Long userId);

    // lấy chi tiết
    @Query("SELECT t FROM Transaction t " +
            "JOIN FETCH t.user " +
            "LEFT JOIN FETCH t.post " +
            "WHERE t.id = :id")
    Optional<Transaction> findByIdWithDetails(@Param("id") Long id);
}
