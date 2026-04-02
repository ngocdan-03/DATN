package com.NgocDan.BACKEND.enums;

import lombok.Getter;

@Getter
public enum VNPayResponseCode {
    CODE_00("00", "Giao dịch thành công"),
    CODE_07("07", "Giao dịch bị nghi ngờ gian lận"),
    CODE_09("09", "Thẻ chưa đăng ký Internet Banking"),
    CODE_10("10", "Xác thực thẻ sai quá 3 lần"),
    CODE_13("13", "Sai mã OTP"),
    CODE_24("24", "Khách hàng đã hủy giao dịch"),
    CODE_51("51", "Tài khoản không đủ số dư"),
    CODE_99("99", "Lỗi hệ thống không xác định");

    private final String code;
    private final String message;

    VNPayResponseCode(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public static String getMessage(String code) {
        for (VNPayResponseCode v : values()) {
            if (v.code.equals(code)) return v.message;
        }
        return "Mã lỗi lạ (" + code + ")";
    }
}
