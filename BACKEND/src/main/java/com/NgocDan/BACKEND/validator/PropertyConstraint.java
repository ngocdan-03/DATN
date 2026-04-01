package com.NgocDan.BACKEND.validator;


import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ElementType.TYPE}) // TYPE nghĩa là dán lên đầu Class PostCreateRequest
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PropertyValidator.class) // Chỉ định file xử lý logic ở Bước 2
@Documented
public @interface PropertyConstraint {
    String message() default "LAND_CANNOT_HAVE_ROOMS"; // Mã lỗi mặc định
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
