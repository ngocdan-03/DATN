package com.NgocDan.BACKEND.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NewsDetailResponse {
    Long id;
    String title;
    String summary;
    String thumbnailUrl;
    String originalUrl; // Xuất hiện ở trang chi tiết để người dùng nhấn xem tin gốc
    String sourceName;
    String category;
    String displayDate; // Ngày đăng hoặc ngày cập nhật
}
