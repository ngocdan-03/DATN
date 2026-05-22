package com.NgocDan.BACKEND.repository;

// QUAN TRỌNG: Sửa lại import này
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.NgocDan.BACKEND.enums.NewsCategory;
import com.NgocDan.BACKEND.enums.NewsStatus;
import com.NgocDan.BACKEND.model.News;

import java.util.Optional;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    @Query("SELECT n FROM News n WHERE n.status = :status " + "AND (:category IS NULL OR n.category = :category) "
            + // Thêm dòng này
            "AND (:keyword IS NULL OR n.title LIKE %:keyword% OR n.summary LIKE %:keyword%)")
    Page<News> searchNewsCustom(
            @Param("keyword") String keyword,
            @Param("category") NewsCategory category, // Thêm param này
            @Param("status") NewsStatus status,
            Pageable pageable);

    Optional<News> findByIdAndStatus(Long id, NewsStatus status);

    @Query(
            value = "SELECT n FROM News n JOIN FETCH n.author a "
                    + "WHERE (:status IS NULL OR n.status = :status) "
                    + "AND (:category IS NULL OR n.category = :category) "
                    + "AND (:keyword IS NULL OR "
                    + "LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
                    + "LOWER(n.summary) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
                    + "LOWER(n.sourceName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
                    + "LOWER(a.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))) "
                    + "ORDER BY n.createdAt DESC",
            countQuery = "SELECT COUNT(n) FROM News n JOIN n.author a "
                    + "WHERE (:status IS NULL OR n.status = :status) "
                    + "AND (:category IS NULL OR n.category = :category) "
                    + "AND (:keyword IS NULL OR "
                    + "LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
                    + "LOWER(n.summary) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
                    + "LOWER(n.sourceName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
                    + "LOWER(a.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<News> findAllForAdmin(
            @Param("keyword") String keyword,
            @Param("category") NewsCategory category,
            @Param("status") NewsStatus status,
            Pageable pageable);
}
