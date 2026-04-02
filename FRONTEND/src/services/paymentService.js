import axios from 'axios';
import { createLogger } from '../utils/logger';

const PAYMENT_BASE_URL = 'http://localhost:8080/real-estate/payment';
const logPaymentService = createLogger('PaymentService');

export const createVNPayPaymentUrl = async ({ amount, description }, accessToken) => {
	const requestUrl = `${PAYMENT_BASE_URL}/create-vnpay-url`;
	const token = accessToken || localStorage.getItem('accessToken');

	if (!token) {
		const noTokenError = new Error('Thieu accessToken cho thao tac thanh toan.');
		noTokenError.code = 'NO_ACCESS_TOKEN';
		throw noTokenError;
	}

	const payload = {
		amount: Number(amount),
		description: description?.trim() || '',
	};

	logPaymentService('Request createVNPayPaymentUrl', {
		requestUrl,
		hasAccessToken: Boolean(token),
		amount: payload.amount,
		description: payload.description,
	});

	try {
		const response = await axios.post(requestUrl, payload, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		logPaymentService('Response createVNPayPaymentUrl', {
			httpStatus: response.status,
			code: response.data?.code,
			message: response.data?.message,
			hasPaymentUrl: Boolean(response.data?.result?.paymentUrl),
		});

		return response;
	} catch (error) {
		logPaymentService('Error createVNPayPaymentUrl', {
			httpStatus: error.response?.status,
			code: error.response?.data?.code || error.code,
			message: error.response?.data?.message || error.message,
			requestUrl,
			hasAccessToken: Boolean(token),
		});
		throw error;
	}
};
