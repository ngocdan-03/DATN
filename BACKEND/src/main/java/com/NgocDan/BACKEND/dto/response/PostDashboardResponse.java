package com.NgocDan.BACKEND.dto.response;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import com.NgocDan.BACKEND.enums.PostStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostDashboardResponse {
    Long id;
    String title;

    @JsonFormat(pattern = "dd-MM-yyyy")
    LocalDateTime createdAt;

    @JsonFormat(pattern = "dd-MM-yyyy")
    LocalDateTime updatedAt;

    Long views;
    PostStatus status;
}
