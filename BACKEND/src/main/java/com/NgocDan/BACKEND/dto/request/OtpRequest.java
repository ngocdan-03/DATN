package com.NgocDan.BACKEND.dto.request;

import com.NgocDan.BACKEND.validator.EmailConstraint;
import com.NgocDan.BACKEND.validator.OtpPurposeConstraint;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OtpRequest {
    @EmailConstraint
    String email;

    @OtpPurposeConstraint
    String purpose;
}
