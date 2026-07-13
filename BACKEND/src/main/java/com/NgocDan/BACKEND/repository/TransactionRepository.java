package com.NgocDan.BACKEND.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.NgocDan.BACKEND.enums.TransactionStatus;
import com.NgocDan.BACKEND.enums.TransactionType;
import com.NgocDan.BACKEND.model.Transaction;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByVnpTxnRef(String vnpTxnRef);

    // lấy danh sách theo trang
    Page<Transaction> findByUserId(Long userId, Pageable pageable);
    // Tìm kiếm giao dịch của User theo keyword trong description
    Page<Transaction> findByUserIdAndDescriptionContainingIgnoreCase(Long userId, String keyword, Pageable pageable);

    // thống kê theo tháng (6 tháng gần nhất)
    @Query(
            value = "SELECT " + "  DATE_FORMAT(created_at, '%m/%Y') as month_year, "
                    + "  SUM(CASE WHEN type IN ('DEPOSIT', 'REFUND') THEN amount ELSE 0 END) as total_deposit, "
                    + "  SUM(CASE WHEN type = 'POST_FEE' THEN amount ELSE 0 END) as total_spend "
                    + "FROM transactions "
                    + "WHERE user_id = :userId AND status = 'SUCCESS' "
                    + "  AND created_at >= DATE_FORMAT(CURDATE() - INTERVAL 5 MONTH, '%Y-%m-01') "
                    + // Chỗ này đã sửa
                    "GROUP BY month_year "
                    + "ORDER BY MIN(created_at) ASC",
            nativeQuery = true)
    List<Object[]> getRawMonthlyStats(@Param("userId") Long userId);

    // lấy chi tiết
    @Query("SELECT t FROM Transaction t " + "JOIN FETCH t.user " + "LEFT JOIN FETCH t.post " + "WHERE t.id = :id")
    Optional<Transaction> findByIdWithDetails(@Param("id") Long id);

    // admin
    // tổng doanh thu toàn tgian
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t "
            + "WHERE t.type = com.NgocDan.BACKEND.enums.TransactionType.POST_FEE "
            + "AND t.status = com.NgocDan.BACKEND.enums.TransactionStatus.SUCCESS")
    BigDecimal getTotalRevenue();

    // Doanh thu theo tháng/năm
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t "
            + "WHERE t.type = com.NgocDan.BACKEND.enums.TransactionType.POST_FEE "
            + "AND t.status = com.NgocDan.BACKEND.enums.TransactionStatus.SUCCESS "
            + "AND YEAR(t.createdAt) = :year "
            + "AND MONTH(t.createdAt) = :month")
    BigDecimal getRevenueByMonth(@Param("year") int year, @Param("month") int month);

    // Doanh thu từng tháng trong năm (cho biểu đồ)
    @Query("SELECT MONTH(t.createdAt), COALESCE(SUM(t.amount), 0) FROM Transaction t "
            + "WHERE t.type = com.NgocDan.BACKEND.enums.TransactionType.POST_FEE "
            + "AND t.status = com.NgocDan.BACKEND.enums.TransactionStatus.SUCCESS "
            + "AND YEAR(t.createdAt) = :year "
            + "GROUP BY MONTH(t.createdAt) "
            + "ORDER BY MONTH(t.createdAt)")
    List<Object[]> getMonthlyRevenueByYear(@Param("year") int year);

    // lấy all giao dịch (cho admin)
    @Query("SELECT t FROM Transaction t JOIN FETCH t.user u " + "WHERE (:type IS NULL OR t.type = :type) "
            + "AND (:status IS NULL OR t.status = :status) "
            + "AND (:keyword IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%',:keyword,'%')) "
            + "     OR LOWER(u.email) LIKE LOWER(CONCAT('%',:keyword,'%'))) "
            + "ORDER BY t.createdAt DESC")
    Page<Transaction> findAllForAdmin(
            @Param("type") TransactionType type,
            @Param("status") TransactionStatus status,
            @Param("keyword") String keyword,
            Pageable pageable);

    // Doanh thu theo ngày
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t "
            + "WHERE t.type = com.NgocDan.BACKEND.enums.TransactionType.POST_FEE "
            + "AND t.status = com.NgocDan.BACKEND.enums.TransactionStatus.SUCCESS "
            + "AND DATE(t.createdAt) = :date")
    BigDecimal getRevenueByDate(@Param("date") LocalDate date);

    // Doanh thu theo năm
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t "
            + "WHERE t.type = com.NgocDan.BACKEND.enums.TransactionType.POST_FEE "
            + "AND t.status = com.NgocDan.BACKEND.enums.TransactionStatus.SUCCESS "
            + "AND YEAR(t.createdAt) = :year")
    BigDecimal getRevenueByYear(@Param("year") int year);

    // Đếm theo type
    long countByType(TransactionType type);

    // Thống kê user mới theo tháng
    @Query("SELECT COUNT(u) FROM User u " + "WHERE YEAR(u.createdAt) = :year " + "AND MONTH(u.createdAt) = :month")
    long countNewUsersByMonth(@Param("year") int year, @Param("month") int month);
}
