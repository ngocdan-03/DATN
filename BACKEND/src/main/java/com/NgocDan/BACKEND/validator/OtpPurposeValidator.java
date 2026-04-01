package com.NgocDan.BACKEND.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class OtpPurposeValidator implements ConstraintValidator<OtpPurposeConstraint, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) return false;
        String purposeRegex = "^(verify|forgot)$";

        return value.matches(purposeRegex);
    }
}
