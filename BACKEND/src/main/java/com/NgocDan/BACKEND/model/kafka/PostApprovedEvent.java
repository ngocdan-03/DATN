package com.NgocDan.BACKEND.model.kafka;

import java.math.BigDecimal;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostApprovedEvent {
    Long postId;
    String title;
    String description;
    String propertyType;
    String listingType;
    BigDecimal area;
    BigDecimal price;
    String wardName;
    String legalStatus;
}
