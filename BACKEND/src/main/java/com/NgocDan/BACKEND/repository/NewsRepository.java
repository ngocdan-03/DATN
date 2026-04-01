package com.NgocDan.BACKEND.repository;

// QUAN TRỌNG: Sửa lại import này
import com.NgocDan.BACKEND.enums.NewsCategory;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.NgocDan.BACKEND.model.News;
import com.NgocDan.BACKEND.enums.NewsStatus; // Import thêm Enum của bạn

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    @Query("SELECT n FROM News n WHERE n.status = :status " +
            "AND (:category IS NULL OR n.category = :category) " + // Thêm dòng này
            "AND (:keyword IS NULL OR n.title LIKE %:keyword% OR n.summary LIKE %:keyword%)")
    Page<News> searchNewsCustom(
            @Param("keyword") String keyword,
            @Param("category") NewsCategory category, // Thêm param này
            @Param("status") NewsStatus status,
            Pageable pageable);
}