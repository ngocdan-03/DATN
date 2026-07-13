package com.NgocDan.BACKEND.dto.response;

import java.time.LocalDateTime;

import lombok.*;
import lombok.experimental.FieldDefaults;

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
