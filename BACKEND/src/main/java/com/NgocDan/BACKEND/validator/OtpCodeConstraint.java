package com.NgocDan.BACKEND.validator;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target({ElementType.FIELD}) // Chỉ định dùng cho các thuộc tính (fields)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = OtpCodeValidator.class) // Kết nối với file xử lý logic
public @interface OtpCodeConstraint {
    String message() default "OTP_INVALID";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
