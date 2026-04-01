package com.NgocDan.BACKEND.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OwnerResponse {
    String fullName;
    String phone;
    String avatarUrl;
    String email;
}
