package com.NgocDan.BACKEND.dto.request;

import com.NgocDan.BACKEND.enums.LegalStatus;
import com.NgocDan.BACKEND.enums.ListingType;
import com.NgocDan.BACKEND.enums.PropertyType;
import com.NgocDan.BACKEND.validator.EmailConstraint;
import com.NgocDan.BACKEND.validator.PasswordConstraint;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostCreateRequest {
    @NotBlank(message = "INVALID_INPUT")
    String title;

    @Min(value = 0, message = "INVALID_INPUT")
    Integer bedrooms;

    @Min(value = 0, message = "INVALID_INPUT")
    Integer bathrooms;

    @NotBlank(message = "INVALID_INPUT")
    String streetAddress;

    @NotBlank(message = "INVALID_INPUT")
    String thumbnailUrl;

    @NotNull(message = "INVALID_INPUT")
    BigDecimal price;

    @NotNull(message = "INVALID_INPUT")
    BigDecimal area;

    @NotNull(message = "INVALID_INPUT")
    PropertyType propertyType;

    @NotNull(message = "INVALID_INPUT")
    ListingType listingType;

    @NotNull(message = "INVALID_INPUT")
    LegalStatus legalStatus;

    @NotBlank(message = "INVALID_INPUT")
    String description;

    @NotNull(message = "INVALID_INPUT")
    Integer wardId; // Nhận ID của Phường/Xã

    @NotNull(message = "INVALID_INPUT")
    List<String> imageUrls; // Danh sách các ảnh chi tiết
}
