import { yupResolver } from '@hookform/resolvers/yup';
import {
	loginSchema,
	registerSchema,
	otpEmailSchema,
	otpCodeSchema,
	forgotResetSchema,
	changePasswordSchema,
	updateInfoSchema,
} from './authSchemas';

import { createPostSchema } from './postSchemas';

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
	changePasswordSchema,
	updateInfoSchema,
};

export const postValidationSchemas = {
	createPostSchema,
};

export const authRegexPatterns = {
	EMAIL_REGEX,
	FULL_NAME_REGEX,
	OTP_REGEX,
	PURPOSE_REGEX,
	STRONG_PASSWORD_REGEX,
	PHONE_REGEX,
};

export const buildYupResolver = (schema) => yupResolver(schema);