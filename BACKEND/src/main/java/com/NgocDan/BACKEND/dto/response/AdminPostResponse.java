package com.NgocDan.BACKEND.dto.response;

import com.NgocDan.BACKEND.enums.LegalStatus;
import com.NgocDan.BACKEND.enums.ListingType;
import com.NgocDan.BACKEND.enums.PostStatus;
import com.NgocDan.BACKEND.enums.PropertyType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminPostResponse {
    Long id;
    String title;
    BigDecimal price;
    BigDecimal area;
    PropertyType propertyType;
    ListingType listingType;
    PostStatus status;
    String wardName;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
