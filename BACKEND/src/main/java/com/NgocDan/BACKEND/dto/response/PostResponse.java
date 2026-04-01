package com.NgocDan.BACKEND.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostResponse {
    Long id;
    String title;
    BigDecimal price;
    BigDecimal area;
    String thumbnailUrl;
    Integer bedrooms;
    Integer bathrooms;
    String wardName;      // Sẽ map từ ward.name
    String propertyType;
    String listingType;
    String displayDate;   // Chuỗi ngày đã định dạng dd/MM/yyyy
}
