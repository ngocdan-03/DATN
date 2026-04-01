package com.NgocDan.BACKEND.dto.request;

import com.NgocDan.BACKEND.enums.LegalStatus;
import com.NgocDan.BACKEND.enums.ListingType;
import com.NgocDan.BACKEND.enums.PropertyType;
import com.NgocDan.BACKEND.validator.EmailConstraint;
import com.NgocDan.BACKEND.validator.PasswordConstraint;
import com.NgocDan.BACKEND.validator.PropertyConstraint;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.validator.constraints.URL;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@PropertyConstraint
public class PostCreateRequest {

    @NotBlank(message = "TITLE_REQUIRED")
    @Size(min = 10, max = 150, message = "TITLE_INVALID_SIZE")
    String title;

    @Min(value = 0, message = "BEDROOMS_INVALID")
    Integer bedrooms;

    @Min(value = 0, message = "BATHROOMS_INVALID")
    Integer bathrooms;

    @NotBlank(message = "ADDRESS_REQUIRED")
    String streetAddress;

    @NotBlank(message = "THUMBNAIL_REQUIRED")
    @Pattern(
            regexp = "^(https?://.*|/.*|[a-zA-Z0-9._-]+\\.(jpg|jpeg|png|gif|webp))$",
            message = "INVALID_URL_FORMAT"
    )
    String thumbnailUrl;

    @NotNull(message = "PRICE_REQUIRED")
    @DecimalMin(value = "10000000", message = "PRICE_TOO_LOW") // Ví dụ: giá tối thiểu 10.000.000 vnđ
    @DecimalMax(value = "999999999999999", message = "PRICE_TOO_LARGE")
    BigDecimal price;

    @NotNull(message = "AREA_REQUIRED")
    @DecimalMin(value = "10.0", message = "AREA_TOO_SMALL") // Diện tích tối thiểu 10m2
    BigDecimal area;

    @NotNull(message = "PROPERTY_TYPE_REQUIRED")
    PropertyType propertyType;

    @NotNull(message = "LISTING_TYPE_REQUIRED")
    ListingType listingType;

    @NotNull(message = "LEGAL_STATUS_REQUIRED")
    LegalStatus legalStatus;

    @NotBlank(message = "DESCRIPTION_REQUIRED")
    @Size(min = 20, message = "DESCRIPTION_TOO_SHORT")
    String description;

    @NotNull(message = "WARD_ID_REQUIRED")
    Integer wardId;

    @NotNull(message = "IMAGES_REQUIRED")
    @Size(min = 1, message = "AT_LEAST_ONE_IMAGE") // Phải có ít nhất 1 ảnh chi tiết
    List<String> imageUrls;
}
