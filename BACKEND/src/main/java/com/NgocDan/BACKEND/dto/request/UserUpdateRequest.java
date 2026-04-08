package com.NgocDan.BACKEND.dto.request;

import com.NgocDan.BACKEND.validator.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    @FullNameConstraint
    String fullName;

    @PhoneConstraint
    String phone;

    @Size(max = 255, message = "ADDRESS_TOO_LONG")
    String address;

    @Min(value = 0, message = "GENDER_INVALID")
    @Max(value = 2, message = "GENDER_INVALID")
    Integer gender;

    @Past(message = "BIRTHDAY_INVALID")
    @JsonFormat(pattern = "dd-MM-yyyy")
    LocalDate birthday;

    @UrlConstraint
    String avatarUrl;
}
