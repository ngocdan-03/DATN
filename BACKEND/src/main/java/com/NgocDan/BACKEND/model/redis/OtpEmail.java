package com.NgocDan.BACKEND.model.redis;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OtpEmail {
    String email;

    String otp;

    String purpose;
}
