package com.NgocDan.BACKEND.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NgocDan.BACKEND.enums.InteractionType;
import com.NgocDan.BACKEND.model.UserInteraction;

import java.util.Optional;

@Repository
public interface UserInteractionRepository extends JpaRepository<UserInteraction, Long> {
    // Check xem user đã lưu tin này chưa
    boolean existsByUserIdAndPostIdAndInteractionType(Long userId, Long postId, InteractionType type);

    // tìm tương tác của user với bài đăng
    Optional<UserInteraction> findByUserIdAndPostIdAndInteractionType(Long userId, Long postId, InteractionType type);

    // Đếm số lượt tương tác (ví dụ: đếm view, đếm save)
    long countByPostIdAndInteractionType(Long postId, InteractionType type);
}
