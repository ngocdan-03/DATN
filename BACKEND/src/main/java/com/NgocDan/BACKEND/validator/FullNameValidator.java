package com.NgocDan.BACKEND.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class FullNameValidator implements ConstraintValidator<FullNameConstraint, String> {

    @Override
    public boolean isValid(String name, ConstraintValidatorContext context) {
        if (name == null || name.trim().isEmpty()) {
            return false;
        }
        String fullNameRegex = "^[\\p{L}]+(\\s[\\p{L}]+)+$";
        return name.matches(fullNameRegex);
    }
}
