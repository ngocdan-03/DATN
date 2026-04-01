import axios from 'axios';
import { createLogger } from '../utils/logger';

const AUTH_BASE_URL = 'http://localhost:8080/real-estate/auth';
const logAuthService = createLogger('AuthService');

const logAuth = (phase, message, data) => {
	logAuthService(`[${phase}] ${message}`, data);
};

const postAuth = async (endpoint, payload) => {
	const url = `${AUTH_BASE_URL}${endpoint}`;

	logAuth('REQUEST', endpoint, payload);

	try {
		const response = await axios.post(url, payload);
		logAuth('RESPONSE', endpoint, {
			httpStatus: response.status,
			code: response.data?.code,
			message: response.data?.message,
		});
		return response;
	} catch (error) {
		logAuth('ERROR', endpoint, {
			httpStatus: error.response?.status,
			code: error.response?.data?.code,
			message: error.response?.data?.message || error.message,
		});
		throw error;
	}
};

// Dang nhap va nhan ve accessToken, refreshToken, thong tin user.
export const loginAuth = ({ email, password }) => {
	return postAuth('/login', {
		email: email.trim(),
		password,
	});
};

// Dang ky tai khoan moi voi thong tin co ban.
export const registerAuth = ({ fullName, email, phone, password }) => {
	return postAuth('/register', {
		fullName: fullName.trim(),
		email: email.trim(),
		phone: phone.trim(),
		password,
	});
};

// Gui lai OTP theo muc dich (verify hoac forgot).
export const resendOtpAuth = ({ email, purpose }) => {
	return postAuth('/resend-otp', {
		email: email.trim(),
		purpose,
	});
};

// Yeu cau he thong gui OTP xac thuc tai khoan lan dau.
export const sendOtpVerifyAuth = ({ email }) => {
	return postAuth('/send-otp-verify', {
		email: email.trim(),
	});
};

// Xac thuc tai khoan bang ma code OTP.
export const verifyAccountAuth = ({ email, code }) => {
	return postAuth('/verify-account', {
		email: email.trim(),
		code: code.trim(),
	});
};

// Bat dau quy trinh quen mat khau bang cach gui OTP ve email.
export const forgotPasswordAuth = ({ email }) => {
	return postAuth('/forgot-password', {
		email: email.trim(),
	});
};

// Dat lai mat khau moi sau khi da co ma OTP hop le.
export const resetPasswordAuth = ({ email, code, newPassword }) => {
	return postAuth('/reset-password', {
		email: email.trim(),
		code: code.trim(),
		newPassword,
	});
};

// Dang xuat o backend bang accessToken hien tai.
export const logoutAuth = ({ accessToken }) => {
	return postAuth('/logout', {
		accessToken,
	});
};
