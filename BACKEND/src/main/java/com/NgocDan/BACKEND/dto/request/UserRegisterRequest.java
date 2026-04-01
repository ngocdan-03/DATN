package com.NgocDan.BACKEND.dto.request;

import com.NgocDan.BACKEND.validator.EmailConstraint;
import com.NgocDan.BACKEND.validator.FullNameConstraint;
import com.NgocDan.BACKEND.validator.PasswordConstraint;
import com.NgocDan.BACKEND.validator.PhoneConstraint;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRegisterRequest {
    @EmailConstraint
    String email;

    @PasswordConstraint
    String password;

    @FullNameConstraint
    String fullName;

    @PhoneConstraint
    String phone;
}
