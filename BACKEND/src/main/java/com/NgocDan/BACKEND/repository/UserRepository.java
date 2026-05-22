package com.NgocDan.BACKEND.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.NgocDan.BACKEND.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByPhoneAndIdNot(String phone, Long userId);

    // cho admin
    // Số user mới trong tháng
    @Query("SELECT COUNT(u) FROM User u " +
            "WHERE YEAR(u.createdAt) = :year " +
            "AND MONTH(u.createdAt) = :month")
    long countNewUsersByMonth(@Param("year") int year, @Param("month") int month);

    // Tổng số user
    long count();

    // lấy all user cho quản lý user
    @Query("SELECT u FROM User u " +
            "WHERE (:keyword IS NULL OR " +
            "LOWER(u.fullName) LIKE LOWER(CONCAT('%',:keyword,'%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%',:keyword,'%')) OR " +
            "u.phone LIKE CONCAT('%',:keyword,'%')) " +
            "AND (:isVerified IS NULL OR u.isVerified = :isVerified) " +
            "AND (:isLocked IS NULL OR u.isLocked = :isLocked) " +
            "ORDER BY u.createdAt DESC")
    Page<User> findAllForAdmin(
            @Param("keyword") String keyword,
            @Param("isVerified") Boolean isVerified,
            @Param("isLocked") Boolean isLocked,
            Pageable pageable);
    // đếm post của user
    @Query("SELECT COUNT(p) FROM Post p WHERE p.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
}
