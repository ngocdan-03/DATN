package com.NgocDan.BACKEND.dto.request;

import com.NgocDan.BACKEND.validator.EmailConstraint;
import com.NgocDan.BACKEND.validator.OtpCodeConstraint;
import com.NgocDan.BACKEND.validator.PasswordConstraint;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VerifyAccountRequest {

    @EmailConstraint
    String email;

    @OtpCodeConstraint
    String code;
}
