package com.NgocDan.BACKEND.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.NgocDan.BACKEND.enums.NewsCategory;
import com.NgocDan.BACKEND.enums.NewsStatus;

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
@Table(name = "news")
public class News {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    User author; // Người viết bài

    @Column(nullable = false)
    String title;

    @Column(columnDefinition = "TEXT")
    String summary;

    @Column(nullable = false)
    String thumbnailUrl;

    @Column(nullable = false, length = 500)
    String originalUrl;

    @Column(length = 100)
    String sourceName;

    @Enumerated(EnumType.STRING)
    NewsCategory category = NewsCategory.MARKET;

    @Enumerated(EnumType.STRING)
    NewsStatus status = NewsStatus.PUBLISHED;

    @CreationTimestamp
    LocalDateTime createdAt;

    @UpdateTimestamp
    LocalDateTime updatedAt;
}
