package com.NgocDan.BACKEND.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public enum ErrorCode {
    // 7xxx: System Errors
    UNCATEGORIZED_EXCEPTION(7001, "Loi he thong khong xac dinh", HttpStatus.INTERNAL_SERVER_ERROR),

    // 2xxx: Auth Service (Bao ve khoi Identity Impersonation)
    UNAUTHENTICATED(2001, "Nguoi dung chua dang nhap", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(2002, "Ban khong co quyen truy cap tinh nang nay", HttpStatus.FORBIDDEN),
    TOKEN_SIGNING_FAILED(2003, "Loi ky token", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_TOKEN(2004, "Token khong hop le hoac da het han", HttpStatus.UNAUTHORIZED),
    TOKEN_REUSE_DETECTED(2005, "Phat hien su dung lai token da bi thu hoi", HttpStatus.UNAUTHORIZED),
    USER_LOCKED(2006, "Tai khoan da bi khoa", HttpStatus.FORBIDDEN),

    // 3xxx: loi tu validation (Bao ve khoi Invalid Data)
    EMAIL_INVALID(3001, "Dia chi email khong hop le", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(3002, "Mat khau khong hop le", HttpStatus.BAD_REQUEST),
    FULLNAME_INVALID(3003, "Ho ten khong hop le", HttpStatus.BAD_REQUEST),
    PHONE_INVALID(3004, "So dien thoai khong hop le", HttpStatus.BAD_REQUEST),
    OTP_INVALID(3005, "Ma OTP khong hop le", HttpStatus.BAD_REQUEST),
    PURPOSE_INVALID(3006, "Muc dich su dung ma OTP khong hop le", HttpStatus.BAD_REQUEST),

    // 1xxx: loi nghiep vu
    USER_EXISTED(1006, "Email nay da duoc dang ky", HttpStatus.BAD_REQUEST),
    PHONE_EXISTED(1007, "So dien thoai nay da duoc su dung", HttpStatus.BAD_REQUEST),
    ROLE_NOT_FOUND(1008, "Quyen nguoi dung khong ton tai", HttpStatus.NOT_FOUND),
    USER_NOT_EXISTED(1009, "Tai khoan khong ton tai", HttpStatus.NOT_FOUND),
    PASSWORD_INCORRECT(1010, "Mat khau hien tai khong dung", HttpStatus.BAD_REQUEST),
    INVALID_OTP(1011, "Ma OTP khong hop le hoac da het han", HttpStatus.BAD_REQUEST),
    USER_NOT_VERIFIED(1012, "Tai khoan chua duoc xac thuc email", HttpStatus.FORBIDDEN),
    OTP_TOO_FREQUENT(1013, "Yeu cau OTP qua nhieu lan, vui long thu lai sau", HttpStatus.TOO_MANY_REQUESTS),
    INVALID_INPUT(1002, "Du lieu dau vao khong hop le", HttpStatus.BAD_REQUEST),

    // 4xxx: Post & New Service
    NEWS_NOT_EXISTED(4001, "Tin tuc khong ton tai", HttpStatus.NOT_FOUND),
    POST_NOT_FOUND(4002, "Bai dang khong ton tai", HttpStatus.NOT_FOUND),

    // 6xxx: Email Service
    EMAIL_SEND_FAILED(6001, "Gui email that bai", HttpStatus.INTERNAL_SERVER_ERROR)
    ;

    private final int code;
    private final String message;
    private final HttpStatus statusCode;

    ErrorCode(int code, String message, HttpStatus statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}