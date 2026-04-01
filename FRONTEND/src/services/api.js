import axios from 'axios';
import { createLogger } from '../utils/logger';

const REFRESH_ENDPOINT = 'http://localhost:8080/real-estate/auth/refresh';

const STORAGE_KEYS = {
	accessToken: 'accessToken',
	refreshToken: 'refreshToken',
	user: 'user',
};

const logApi = createLogger('ApiInterceptor');

let isRefreshing = false;
let pending401Queue = [];
let isSessionExpiredAlertShown = false;

const getRequestInfo = (requestConfig = {}) => ({
	url: requestConfig.url,
	method: requestConfig.method,
});

const getRefreshToken = () => localStorage.getItem(STORAGE_KEYS.refreshToken);

const clearSession = () => {
	localStorage.removeItem(STORAGE_KEYS.accessToken);
	localStorage.removeItem(STORAGE_KEYS.refreshToken);
	localStorage.removeItem(STORAGE_KEYS.user);
};

const flushPendingQueue = (error, nextAccessToken) => {
	pending401Queue.forEach((pending) => {
		if (error) {
			pending.reject(error);
			return;
		}
		pending.resolve(nextAccessToken);
	});
	pending401Queue = [];
};

const notifyExpiredSession = (messageFromBe) => {
	if (typeof window === 'undefined' || isSessionExpiredAlertShown) return;
	isSessionExpiredAlertShown = true;
	window.alert(messageFromBe || 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
	window.location.assign('/login');
};

const callRefreshToken = async () => {
	const refreshToken = getRefreshToken();
	if (!refreshToken) {
		const noRtError = new Error('Không có refresh token.');
		noRtError.code = 'NO_REFRESH_TOKEN';
		throw noRtError;
	}

	logApi('Request refresh token', { endpoint: REFRESH_ENDPOINT });

	const response = await axios.post(
		REFRESH_ENDPOINT,
		{ refreshToken },
		{
			skipAuthRefresh: true,
		},
	);

	logApi('Response refresh token', {
		httpStatus: response.status,
		code: response.data?.code,
		message: response.data?.message,
	});

	if (response.data?.code !== 1000 || !response.data?.result?.accessToken || !response.data?.result?.refreshToken) {
		const refreshFailedError = new Error(response.data?.message || 'Refresh token thất bại.');
		refreshFailedError.response = response;
		throw refreshFailedError;
	}

	logApi('DA GOI API REFRESH THANH CONG', {
		message: response.data?.message,
	});

	return {
		accessToken: response.data.result.accessToken,
		refreshToken: response.data.result.refreshToken,
	};
};

axios.interceptors.request.use(
	(config) => {
		return config;
	},
	(requestError) => Promise.reject(requestError),
);

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config || {};
		const httpStatus = error.response?.status;
		const requestHasBearerToken = Boolean(originalRequest.headers?.Authorization);

		if (originalRequest.skipAuthRefresh || httpStatus !== 401 || originalRequest._retry || !requestHasBearerToken) {
			return Promise.reject(error);
		}

		logApi('Receive 401 on authenticated request', {
			...getRequestInfo(originalRequest),
			httpStatus,
		});

		if (isRefreshing) {
			logApi('Refresh is in progress, queue request retry', {
				...getRequestInfo(originalRequest),
				queueSize: pending401Queue.length + 1,
			});

			return new Promise((resolve, reject) => {
				pending401Queue.push({ resolve, reject });
			})
				.then((newAccessToken) => {
					const retryRequest = {
						...originalRequest,
						headers: {
							...(originalRequest.headers || {}),
							Authorization: `Bearer ${newAccessToken}`,
						},
					};

					logApi('Retry queued request with refreshed token', {
						...getRequestInfo(retryRequest),
					});

					return axios(retryRequest)
						.then((retryResponse) => {
							logApi('Retry queued request success', {
								...getRequestInfo(retryRequest),
								httpStatus: retryResponse.status,
							});
							return retryResponse;
						})
						.catch((retryError) => {
							logApi('Retry queued request failed', {
								...getRequestInfo(retryRequest),
								httpStatus: retryError.response?.status,
								message: retryError.response?.data?.message || retryError.message,
							});
							throw retryError;
						});
				})
				.catch((queueError) => Promise.reject(queueError));
		}

		originalRequest._retry = true;
		isRefreshing = true;

		try {
			const refreshedTokens = await callRefreshToken();
			localStorage.setItem(STORAGE_KEYS.accessToken, refreshedTokens.accessToken);
			localStorage.setItem(STORAGE_KEYS.refreshToken, refreshedTokens.refreshToken);

			logApi('Apply refreshed tokens and retry original request', {
				...getRequestInfo(originalRequest),
				queuedRequests: pending401Queue.length,
			});

			flushPendingQueue(null, refreshedTokens.accessToken);

			const retryRequest = {
				...originalRequest,
				headers: {
					...(originalRequest.headers || {}),
					Authorization: `Bearer ${refreshedTokens.accessToken}`,
				},
			};

			return axios(retryRequest)
				.then((retryResponse) => {
					logApi('Retry original request success', {
						...getRequestInfo(retryRequest),
						httpStatus: retryResponse.status,
					});
					return retryResponse;
				})
				.catch((retryError) => {
					logApi('Retry original request failed', {
						...getRequestInfo(retryRequest),
						httpStatus: retryError.response?.status,
						message: retryError.response?.data?.message || retryError.message,
					});
					throw retryError;
				});
		} catch (refreshError) {
			logApi('Refresh token failed', {
				httpStatus: refreshError.response?.status,
				code: refreshError.response?.data?.code || refreshError.code,
				message: refreshError.response?.data?.message || refreshError.message,
			});

			flushPendingQueue(refreshError, null);
			clearSession();
			notifyExpiredSession(refreshError.response?.data?.message || refreshError.message);
			return Promise.reject(refreshError);
		} finally {
			isRefreshing = false;
		}
	},
);

