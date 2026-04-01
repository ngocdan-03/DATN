package com.NgocDan.BACKEND.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class OtpCodeValidator implements ConstraintValidator<OtpCodeConstraint, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) return false;
        // Kiểm tra xem có đúng 6 chữ số hay không
        String otpRegex = "^[0-9]{6}$";
        return value.matches(otpRegex);
    }
}
