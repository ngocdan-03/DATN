package com.NgocDan.BACKEND.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminUserResponse {
    Long id;
    String fullName;
    String email;
    String phone;
    Boolean isVerified;
    Boolean isLocked;
    LocalDateTime createdAt;
    LocalDateTime updateAt;
}
