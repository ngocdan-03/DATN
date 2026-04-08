package com.NgocDan.BACKEND.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDashboardResponse {
    Long id;
    String email;
    String fullName;
    String phone;
    String address;
    String avatarUrl;

    // Các trường chi tiết hơn
    Integer gender;
    LocalDate birthday;
    BigDecimal balance;

    // Trạng thái tài khoản
    Boolean isVerified;
    LocalDateTime createdAt;
    LocalDateTime updateAt;
}
