package com.NgocDan.BACKEND.dto.response;

import java.time.LocalDateTime;

import com.NgocDan.BACKEND.enums.NewsCategory;
import com.NgocDan.BACKEND.enums.NewsStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminNewsDetailResponse {
    Long id;
    String title;
    String summary;
    String thumbnailUrl;
    String originalUrl;
    String sourceName;
    NewsCategory category;
    NewsStatus status;
    String authorName;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
