import * as yup from 'yup';
import {
	EMAIL_REGEX,
	FULL_NAME_REGEX,
	OTP_REGEX,
	PURPOSE_REGEX,
	STRONG_PASSWORD_REGEX,
	PHONE_REGEX,
} from './regexPatterns';

// check cho login form
export const loginSchema = yup.object({
	email: yup
		.string()
		.trim()
		.required('Email là bắt buộc.')
		.matches(EMAIL_REGEX, 'Email không đúng định dạng cho phép.'),
	password: yup
		.string()
		.required('Mật khẩu là bắt buộc.')
		.matches(
			STRONG_PASSWORD_REGEX,
			'Mật khẩu phải có chữ hoa, chữ thường, số, ký tự đặc biệt và tối thiểu 8 ký tự.',
		),
});

// check cho register form
export const registerSchema = yup.object({
	fullName: yup
		.string()
		.trim()
		.required('Họ và tên là bắt buộc.')
		.matches(FULL_NAME_REGEX, 'Họ và tên phải gồm ít nhất 2 từ và chỉ chứa chữ cái.'),
	email: yup
		.string()
		.trim()
		.required('Email là bắt buộc.')
		.matches(EMAIL_REGEX, 'Email không đúng định dạng cho phép.'),
	phone: yup
		.string()
		.trim()
		.required('Số điện thoại là bắt buộc.')
		.matches(PHONE_REGEX, 'Số điện thoại phải theo định dạng Việt Nam (10 số).'),
	password: yup
		.string()
		.required('Mật khẩu là bắt buộc.')
		.matches(
			STRONG_PASSWORD_REGEX,
			'Mật khẩu phải có chữ hoa, chữ thường, số, ký tự đặc biệt và tối thiểu 8 ký tự.',
		),
});

// check cho purpose and email
export const otpEmailSchema = yup.object({
	email: yup
		.string()
		.trim()
		.required('Email là bắt buộc.')
		.matches(EMAIL_REGEX, 'Email không đúng định dạng cho phép.'),
	purpose: yup
		.string()
		.trim()
		.required('Purpose là bắt buộc.')
		.matches(PURPOSE_REGEX, 'Purpose chỉ nhận verify hoặc forgot.'),
});

// check otp code
export const otpCodeSchema = yup.object({
	code: yup
		.string()
		.trim()
		.required('Mã OTP là bắt buộc.')
		.matches(OTP_REGEX, 'Mã OTP phải gồm đúng 6 chữ số.'),
});

// check cho reset password form
export const forgotResetSchema = yup.object({
	code: yup
		.string()
		.trim()
		.required('Mã OTP là bắt buộc.')
		.matches(OTP_REGEX, 'Mã OTP phải gồm đúng 6 chữ số.'),
	newPassword: yup
		.string()
		.required('Mật khẩu mới là bắt buộc.')
		.matches(
			STRONG_PASSWORD_REGEX,
			'Mật khẩu phải có chữ hoa, chữ thường, số, ký tự đặc biệt và tối thiểu 8 ký tự.',
		),
});

export const changePasswordSchema = yup.object({
	oldPassword: yup
		.string()
		.required('Mật khẩu hiện tại là bắt buộc.'),
	newPassword: yup
		.string()
		.required('Mật khẩu mới là bắt buộc.')
		.matches(
			STRONG_PASSWORD_REGEX,
			'Mật khẩu phải có chữ hoa, chữ thường, số, ký tự đặc biệt và tối thiểu 8 ký tự.',
		)
		.notOneOf([yup.ref('oldPassword')], 'Mật khẩu mới không được trùng với mật khẩu cũ.'),
	confirmPassword: yup
		.string()
		.required('Xác nhận mật khẩu là bắt buộc.')
		.oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp.'),
});

// check cho cập nhật thông tin cá nhân
export const updateInfoSchema = yup.object({
	fullName: yup
		.string()
		.trim()
		.required('Họ và tên là bắt buộc.')
		.matches(FULL_NAME_REGEX, 'Họ và tên phải gồm ít nhất 2 từ và chỉ chứa chữ cái.'),
	phone: yup
		.string()
		.trim()
		.required('Số điện thoại là bắt buộc.')
		.matches(PHONE_REGEX, 'Số điện thoại phải theo định dạng Việt Nam (10 số).'),
	gender: yup
		.number()
		.required('Vui lòng chọn giới tính.')
		.oneOf([0, 1, 2], 'Giới tính không hợp lệ.'),
	birthday: yup
		.string()
		.required('Ngày sinh là bắt buộc.')
		.test('is-past', 'Ngày sinh phải là một ngày trong quá khứ.', (value) => {
			if (!value) return false;
			return new Date(value) < new Date();
		}),
	address: yup
		.string()
		.trim()
		.max(255, 'Địa chỉ không được vượt quá 255 ký tự.'),
});