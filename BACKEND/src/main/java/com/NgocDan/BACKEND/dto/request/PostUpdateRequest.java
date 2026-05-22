package com.NgocDan.BACKEND.dto.request;

import com.NgocDan.BACKEND.enums.LegalStatus;
import com.NgocDan.BACKEND.enums.ListingType;
import com.NgocDan.BACKEND.enums.PropertyType;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostUpdateRequest {
    @NotBlank(message = "TITLE_REQUIRED")
    @Size(min = 10, max = 150, message = "TITLE_INVALID_SIZE")
    String title;

    @NotBlank(message = "DESCRIPTION_REQUIRED")
    @Size(min = 20, message = "DESCRIPTION_TOO_SHORT")
    String description;

    @NotNull(message = "PROPERTY_TYPE_REQUIRED")
    PropertyType propertyType;

    @NotNull(message = "LISTING_TYPE_REQUIRED")
    ListingType listingType;

    @NotNull(message = "LEGAL_STATUS_REQUIRED")
    LegalStatus legalStatus;

    @NotNull(message = "PRICE_REQUIRED")
    @DecimalMin(value = "10000000", message = "PRICE_TOO_LOW")
    @DecimalMax(value = "999999999999999", message = "PRICE_TOO_LARGE")
    BigDecimal price;

    @NotNull(message = "AREA_REQUIRED")
    @DecimalMin(value = "10.0", message = "AREA_TOO_SMALL")
    BigDecimal area;

    @Min(value = 0, message = "BEDROOMS_INVALID")
    Integer bedrooms;

    @Min(value = 0, message = "BATHROOMS_INVALID")
    Integer bathrooms;

    @NotNull(message = "WARD_ID_REQUIRED")
    Integer wardId;

    @NotBlank(message = "ADDRESS_REQUIRED")
    String streetAddress;

}
