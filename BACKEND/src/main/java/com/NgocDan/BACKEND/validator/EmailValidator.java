package com.NgocDan.BACKEND.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class EmailValidator implements ConstraintValidator<EmailConstraint, String> {
    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null || email.isEmpty()) {
            return false;
        }
        // Regex kiểm tra định dạng email cơ bản
        String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.(com|vn|com\\.vn|net|edu\\.vn|org\\.vn)$";
        return email.matches(emailRegex);
    }
}
