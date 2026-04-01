import { yupResolver } from '@hookform/resolvers/yup';
import {
	loginSchema,
	registerSchema,
	otpEmailSchema,
	otpCodeSchema,
	forgotResetSchema,
} from './authSchemas';
import {
	EMAIL_REGEX,
	FULL_NAME_REGEX,
	OTP_REGEX,
	PURPOSE_REGEX,
	STRONG_PASSWORD_REGEX,
	PHONE_REGEX,
} from './regexPatterns';

export const authValidationSchemas = {
	loginSchema,
	registerSchema,
	otpEmailSchema,
	otpCodeSchema,
	forgotResetSchema,
};

export const authRegexPatterns = {
	EMAIL_REGEX,
	FULL_NAME_REGEX,
	OTP_REGEX,
	PURPOSE_REGEX,
	STRONG_PASSWORD_REGEX,
	PHONE_REGEX,
};

// Helper tao resolver cho React Hook Form.
export const buildYupResolver = (schema) => yupResolver(schema);
