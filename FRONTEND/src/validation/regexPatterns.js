// Regex patterns dong bo voi BE de validate dau vao o FE.
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|vn|com\.vn|net|edu\.vn|org\.vn)$/;
export const FULL_NAME_REGEX = /^[\p{L}]+(\s[\p{L}]+)+$/u;
export const OTP_REGEX = /^[0-9]{6}$/;
export const PURPOSE_REGEX = /^(verify|forgot)$/;
export const STRONG_PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/;
export const PHONE_REGEX = /^0[35789][0-9]{8}$/;
