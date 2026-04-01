package com.NgocDan.BACKEND.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PhoneValidator implements ConstraintValidator<PhoneConstraint, String> {

    @Override
    public boolean isValid(String phone, ConstraintValidatorContext context) {
        if (phone == null || phone.isEmpty()) {
            return false;
        }
        // Regex
        String phoneRegex = "^0[35789][0-9]{8}$";
        return phone.matches(phoneRegex);
    }
}
