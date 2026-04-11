package com.NgocDan.BACKEND.dto.response;

import java.math.BigDecimal;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostDetailResponse {
    Long id;
    String title;
    String description;
    BigDecimal price;
    BigDecimal area;
    String streetAddress;
    String wardName;
    Integer bedrooms;
    Integer bathrooms;
    String propertyType;
    String listingType;
    String legalStatus;
    String displayDate;

    OwnerResponse owner; // Thông tin người đăng
    List<String> imageUrls; // Danh sách Album ảnh
    boolean isFavorite;
}
