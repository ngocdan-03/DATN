package com.NgocDan.BACKEND.repository;



import com.NgocDan.BACKEND.enums.LegalStatus;
import com.NgocDan.BACKEND.enums.ListingType;
import com.NgocDan.BACKEND.enums.PropertyType;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.NgocDan.BACKEND.enums.PostStatus;
import com.NgocDan.BACKEND.model.Post;

import java.math.BigDecimal;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p JOIN FETCH p.ward w " +
            "WHERE p.status = :status " +
            "ORDER BY COALESCE(p.updatedAt, p.createdAt) DESC")
    Page<Post> findAllCustom(@Param("status") PostStatus status, Pageable pageable);

    // get theo bộ lọc
    @Query("SELECT p FROM Post p JOIN FETCH p.ward w " +
            "WHERE p.status = :status " +
            "AND (:keyword IS NULL OR p.title LIKE %:keyword%) " +
            "AND (:wardId IS NULL OR p.ward.id = :wardId) " +
            "AND (:propertyType IS NULL OR p.propertyType = :propertyType) " +
            "AND (:listingType IS NULL OR p.listingType = :listingType) " +
            "AND (:legalStatus IS NULL OR p.legalStatus = :legalStatus) " +
            "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
            "AND (:minArea IS NULL OR p.area >= :minArea) " +
            "AND (:maxArea IS NULL OR p.area <= :maxArea) " +
            "AND (:minBedrooms IS NULL OR p.bedrooms >= :minBedrooms) " +
            "AND (:minBathrooms IS NULL OR p.bathrooms >= :minBathrooms) " +
            "ORDER BY COALESCE(p.updatedAt, p.createdAt) DESC")
    Page<Post> searchPostsAdvanced(
            @Param("status") PostStatus status,
            @Param("keyword") String keyword,
            @Param("wardId") Integer wardId,
            @Param("propertyType") PropertyType propertyType,
            @Param("listingType") ListingType listingType,
            @Param("legalStatus") LegalStatus legalStatus,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minArea") BigDecimal minArea,
            @Param("maxArea") BigDecimal maxArea,
            @Param("minBedrooms") Integer minBedrooms,
            @Param("minBathrooms") Integer minBathrooms,
            Pageable pageable);

}
