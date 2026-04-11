package com.NgocDan.BACKEND.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.NgocDan.BACKEND.enums.LegalStatus;
import com.NgocDan.BACKEND.enums.ListingType;
import com.NgocDan.BACKEND.enums.PostStatus;
import com.NgocDan.BACKEND.enums.PropertyType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ward_id", nullable = false)
    Ward ward;

    @Column(nullable = false)
    String title;

    @Builder.Default
    Integer bedrooms = 0;

    @Builder.Default
    Integer bathrooms = 0;

    @Column(nullable = false)
    String streetAddress;

    @Column(nullable = false)
    String thumbnailUrl;

    @Column(nullable = false)
    BigDecimal price;

    @Column(nullable = false)
    BigDecimal area;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    PropertyType propertyType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ListingType listingType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    LegalStatus legalStatus;

    @Column(columnDefinition = "TEXT", nullable = false)
    String description;

    @Enumerated(EnumType.STRING)
    PostStatus status = PostStatus.PENDING;

    @CreationTimestamp
    LocalDateTime createdAt;

    @UpdateTimestamp
    LocalDateTime updatedAt;

    // Liên kết với bảng post_images
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    List<PostImage> images = new ArrayList<>();
}
