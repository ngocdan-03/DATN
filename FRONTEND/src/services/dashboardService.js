import axios from 'axios';
import { createLogger } from '../utils/logger';

const DASHBOARD_BASE_URL = 'http://localhost:8080/real-estate/dashboard';
const FINANCE_SUMMARY_URL = 'http://localhost:8080/real-estate/finance/summary';
const FINANCE_TRANSACTION_DETAIL_URL = 'http://localhost:8080/real-estate/finance/transactions';
const logDashboardService = createLogger('DashboardService');

export const getDashboardOverview = async (accessToken) => {
	const requestUrl = `${DASHBOARD_BASE_URL}/overview`;
	const token = accessToken || localStorage.getItem('accessToken');

	if (!token) {
		const noTokenError = new Error('Thieu accessToken de lay thong tin dashboard.');
		noTokenError.code = 'NO_ACCESS_TOKEN';
		throw noTokenError;
	}

	logDashboardService('Request getDashboardOverview', {
		requestUrl,
		hasAccessToken: Boolean(token),
	});

	try {
		const response = await axios.get(requestUrl, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		logDashboardService('Response getDashboardOverview', {
			httpStatus: response.status,
			code: response.data?.code,
			message: response.data?.message,
		});

		return response;
	} catch (error) {
		logDashboardService('Error getDashboardOverview', {
			httpStatus: error.response?.status,
			code: error.response?.data?.code || error.code,
			message: error.response?.data?.message || error.message,
			requestUrl,
		});
		throw error;
	}
};

export const getFinanceSummary = async ({ page = 1, size = 5, keyword = '', accessToken } = {}) => {
	const requestUrl = FINANCE_SUMMARY_URL;
	const token = accessToken || localStorage.getItem('accessToken');
	const normalizedKeyword = String(keyword || '').trim();
	const params = {
		page,
		size,
		keyword: normalizedKeyword,
	};

	if (!token) {
		const noTokenError = new Error('Thieu accessToken de lay thong tin tai chinh.');
		noTokenError.code = 'NO_ACCESS_TOKEN';
		throw noTokenError;
	}

	logDashboardService('Request getFinanceSummary', {
		requestUrl,
		params,
		hasAccessToken: Boolean(token),
	});

	try {
		const response = await axios.get(requestUrl, {
			params,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		logDashboardService('Response getFinanceSummary', {
			httpStatus: response.status,
			code: response.data?.code,
			message: response.data?.message,
			transactions: response.data?.result?.transactions?.data?.length || 0,
			currentPage: response.data?.result?.transactions?.currentPage,
			totalPages: response.data?.result?.transactions?.totalPages,
			chartPoints: response.data?.result?.chartData?.length || 0,
		});

		return response;
	} catch (error) {
		logDashboardService('Error getFinanceSummary', {
			httpStatus: error.response?.status,
			code: error.response?.data?.code || error.code,
			message: error.response?.data?.message || error.message,
			requestUrl,
			params,
		});
		throw error;
	}
};

export const getFinanceTransactionDetail = async (transactionId, accessToken) => {
	const requestUrl = `${FINANCE_TRANSACTION_DETAIL_URL}/${transactionId}`;
	const token = accessToken || localStorage.getItem('accessToken');

	if (!token) {
		const noTokenError = new Error('Thieu accessToken de lay chi tiet giao dich.');
		noTokenError.code = 'NO_ACCESS_TOKEN';
		throw noTokenError;
	}

	logDashboardService('Request getFinanceTransactionDetail', {
		requestUrl,
		transactionId,
		hasAccessToken: Boolean(token),
	});

	try {
		const response = await axios.get(requestUrl, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		logDashboardService('Response getFinanceTransactionDetail', {
			httpStatus: response.status,
			code: response.data?.code,
			message: response.data?.message,
			transactionId: response.data?.result?.id,
		});

		return response;
	} catch (error) {
		logDashboardService('Error getFinanceTransactionDetail', {
			httpStatus: error.response?.status,
			code: error.response?.data?.code || error.code,
			message: error.response?.data?.message || error.message,
			requestUrl,
			transactionId,
		});
		throw error;
	}
};