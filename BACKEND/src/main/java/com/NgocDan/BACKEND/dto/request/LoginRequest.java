package com.NgocDan.BACKEND.dto.request;

import com.NgocDan.BACKEND.validator.EmailConstraint;
import com.NgocDan.BACKEND.validator.PasswordConstraint;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginRequest {
    @EmailConstraint
    String email;

    @PasswordConstraint
    String password;
}
