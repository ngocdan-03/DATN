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
    TITLE_REQUIRED(3007, "Tieu de khong duoc de trong", HttpStatus.BAD_REQUEST),
    BEDROOMS_INVALID(3008, "So phong ngu it nhat la 0", HttpStatus.BAD_REQUEST),
    BATHROOMS_INVALID(3009, "So phong tam it nhat la 0", HttpStatus.BAD_REQUEST),
    ADDRESS_REQUIRED(3010, "Dia chi khong duoc de trong", HttpStatus.BAD_REQUEST),
    THUMBNAIL_REQUIRED(3011, "Thumbnail khong duoc de trong", HttpStatus.BAD_REQUEST),
    INVALID_URL_FORMAT(3012, "URL khong hop le", HttpStatus.BAD_REQUEST),
    PRICE_REQUIRED(3013, "Gia khong duoc de trong", HttpStatus.BAD_REQUEST),
    PRICE_TOO_LOW(3014, "Gia phai lon hon 10000000", HttpStatus.BAD_REQUEST),
    AREA_REQUIRED(3015, "Dien tich khong duoc de trong", HttpStatus.BAD_REQUEST),
    AREA_TOO_SMALL(3016, "Dien tich phai lon hon 10", HttpStatus.BAD_REQUEST),
    PROPERTY_TYPE_REQUIRED(3017, "Loai bat dong san khong duoc de trong", HttpStatus.BAD_REQUEST),
    LISTING_TYPE_REQUIRED(3018, "Loai tin rao khong duoc de trong", HttpStatus.BAD_REQUEST),
    LEGAL_STATUS_REQUIRED(3019, "Tinh trang phap ly khong duoc de trong", HttpStatus.BAD_REQUEST),
    DESCRIPTION_REQUIRED(3020, "Mo ta khong duoc de trong", HttpStatus.BAD_REQUEST),
    DESCRIPTION_TOO_SHORT(3021, "Mo ta phai it nhat 20 ky tu", HttpStatus.BAD_REQUEST),
    WARD_ID_REQUIRED(3022, "Phuong khong duoc de trong", HttpStatus.BAD_REQUEST),
    IMAGES_REQUIRED(3023, "Anh dai dien khong duoc de trong", HttpStatus.BAD_REQUEST),
    AT_LEAST_ONE_IMAGE(3024, "Phai co it nhat 1 anh", HttpStatus.BAD_REQUEST),
    LAND_CANNOT_HAVE_ROOMS(
            3025, "Loai bat dong san 'Dat' khong duoc co phong ngu hay phong tam", HttpStatus.BAD_REQUEST),
    WARD_NOT_FOUND(3026, "Phuong khong ton tai", HttpStatus.NOT_FOUND),
    TITLE_INVALID_SIZE(3027, "Tieu de phai tu 10 den 150 ky tu", HttpStatus.BAD_REQUEST),
    PRICE_TOO_LARGE(3028, "Gia phai nho hon 999999999999999", HttpStatus.BAD_REQUEST),
    ADDRESS_TOO_LONG(3029, "Dia chi khong duoc qua 255 ky tu", HttpStatus.BAD_REQUEST),
    GENDER_INVALID(3030, "Gioi tinh khong hop le", HttpStatus.BAD_REQUEST),
    BIRTHDAY_INVALID(3031, "Ngay sinh khong hop le", HttpStatus.BAD_REQUEST),
    INVALID_DATE_FORMAT(3032, "Ngay thang khong hop le, dung dinh dang dd-MM-yyyy", HttpStatus.BAD_REQUEST),
    FORMAT_INVALID(3033, "Dinh dang du lieu khong hop le", HttpStatus.BAD_REQUEST),
    PASSWORD_REQUIRED(3034, "Mat khau khong duoc de trong", HttpStatus.BAD_REQUEST),
    UPLOAD_SIZE_EXCEEDED(3035, "Kich thuoc file vuot qua gioi han cho phep", HttpStatus.BAD_REQUEST),

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
    TRANSACTION_NOT_EXISTED(1003, "Giao dich khong ton tai", HttpStatus.NOT_FOUND),
    INSUFFICIENT_BALANCE(1004, "So du khong du de thuc hien giao dich", HttpStatus.BAD_REQUEST),
    OLD_PASSWORD_INCORRECT(1005, "Mat khau cu khong dung", HttpStatus.BAD_REQUEST),
    NEW_PASSWORD_SAME_AS_OLD(1006, "Mat khau moi khong duoc giong mat khau cu", HttpStatus.BAD_REQUEST),
    CONFIRM_PASSWORD_NOT_MATCH(1007, "Mat khau xac nhan khong khop", HttpStatus.BAD_REQUEST),

    // 4xxx: Post & New Service
    NEWS_NOT_EXISTED(4001, "Tin tuc khong ton tai", HttpStatus.NOT_FOUND),
    POST_NOT_FOUND(4002, "Bai dang khong ton tai", HttpStatus.NOT_FOUND),

    // 6xxx: Email Service
    EMAIL_SEND_FAILED(6001, "Gui email that bai", HttpStatus.INTERNAL_SERVER_ERROR);

    private final int code;
    private final String message;
    private final HttpStatus statusCode;

    ErrorCode(int code, String message, HttpStatus statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
