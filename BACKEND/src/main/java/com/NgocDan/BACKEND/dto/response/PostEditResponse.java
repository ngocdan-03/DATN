package com.NgocDan.BACKEND.dto.response;

import com.NgocDan.BACKEND.enums.LegalStatus;
import com.NgocDan.BACKEND.enums.ListingType;
import com.NgocDan.BACKEND.enums.PropertyType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostEditResponse {
    Long id;
    String title;
    Integer bedrooms;
    Integer bathrooms;
    String streetAddress;

    // Hình ảnh để hiển thị xem trước (Preview)
    String thumbnailUrl;
    List<String> imageUrls;

    BigDecimal price;
    BigDecimal area;

    PropertyType propertyType;
    ListingType listingType;
    LegalStatus legalStatus;
    String description;

    // Trả về wardId để FE tự động chọn đúng Option trong Select xã/phường
    Integer wardId;
}