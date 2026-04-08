package com.NgocDan.BACKEND.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ ElementType.FIELD }) // Chỉ định dùng cho các thuộc tính (fields)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UrlValidator.class) // Kết nối với file xử lý logic
public @interface UrlConstraint {
    String message() default "INVALID_URL_FORMAT";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
