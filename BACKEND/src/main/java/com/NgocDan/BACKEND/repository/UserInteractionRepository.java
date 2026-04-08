package com.NgocDan.BACKEND.repository;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.NgocDan.BACKEND.enums.InteractionType;
import com.NgocDan.BACKEND.model.UserInteraction;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserInteractionRepository extends JpaRepository<UserInteraction, Long> {
    // Check xem user đã lưu tin này chưa
    boolean existsByUserIdAndPostIdAndInteractionType(Long userId, Long postId, InteractionType type);

    // tìm tương tác của user với bài đăng
    Optional<UserInteraction> findByUserIdAndPostIdAndInteractionType(Long userId, Long postId, InteractionType type);

    // Tính tổng lượt xem của tất cả các bài thuộc sở hữu của User (Seller)
    @Query("SELECT COUNT(ui) FROM UserInteraction ui " +
            "WHERE ui.post.user.id = :ownerId AND ui.interactionType = 'VIEW'")
    long countTotalViewsByOwner(@Param("ownerId") Long ownerId);

    // Lấy lượt xem theo từng ngày (chỉ lấy bài của chính mình)
    @Query("SELECT DATE(ui.createdAt), COUNT(ui) FROM UserInteraction ui " +
            "WHERE ui.post.user.id = :ownerId " +
            "AND ui.interactionType = 'VIEW' " +
            "AND ui.createdAt >= :startDate " +
            "GROUP BY DATE(ui.createdAt)")
    List<Object[]> getViewTrendRaw(@Param("ownerId") Long ownerId, @Param("startDate") LocalDateTime startDate);
}
