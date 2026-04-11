package com.NgocDan.BACKEND.model.redis;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class RefreshToken {
    String id; // jti

    String userId;

    String familyId;
}
