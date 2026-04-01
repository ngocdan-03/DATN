package com.NgocDan.BACKEND.validator;

import com.NgocDan.BACKEND.dto.request.PostCreateRequest;
import com.NgocDan.BACKEND.enums.PropertyType;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PropertyValidator implements ConstraintValidator<PropertyConstraint, PostCreateRequest> {

    @Override
    public boolean isValid(PostCreateRequest request, ConstraintValidatorContext context) {
        // Nếu request trống hoặc chưa chọn loại BĐS thì bỏ qua (để @NotNull lo)
        if (request == null || request.getPropertyType() == null) {
            return true;
        }

        // LOGIC CHÍNH: Nếu là ĐẤT NỀN (LAND)
        if (request.getPropertyType() == PropertyType.LAND) {
            // Kiểm tra số phòng ngủ hoặc phòng tắm có > 0 không
            boolean hasBedrooms = request.getBedrooms() != null && request.getBedrooms() > 0;
            boolean hasBathrooms = request.getBathrooms() != null && request.getBathrooms() > 0;

            // Nếu có phòng thì return false (báo lỗi)
            return !(hasBedrooms || hasBathrooms);
        }

        return true; // Các loại BĐS khác (Nhà, Căn hộ) thì hợp lệ
    }
}
