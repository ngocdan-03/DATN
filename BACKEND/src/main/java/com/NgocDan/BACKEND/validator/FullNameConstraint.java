package com.NgocDan.BACKEND.validator;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = FullNameValidator.class)
public @interface FullNameConstraint {
    String message() default "FULLNAME_INVALID";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
