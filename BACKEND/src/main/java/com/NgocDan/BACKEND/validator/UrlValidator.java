package com.NgocDan.BACKEND.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class UrlValidator implements ConstraintValidator<UrlConstraint, String> {
    @Override
    public boolean isValid(String url, ConstraintValidatorContext context) {
        if (url == null || url.isEmpty()) {
            return false;
        }
        // Regex kiểm tra định dạng email cơ bản
        String urlRegex = "^(https?://|/)?([a-zA-Z0-9._/\\-]+)\\.(jpg|jpeg|png|gif|webp)$";
        return url.matches(urlRegex);
    }
}
