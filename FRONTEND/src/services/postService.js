import axios from 'axios';
import { createLogger } from '../utils/logger';

const POST_BASE_URL = 'http://localhost:8080/real-estate/posts';
const logPostService = createLogger('PostService');

// Lay danh sach bai dang bat dong san theo trang, ho tro search va bo loc backend.
export const getAllPosts = async ({
	page = 1,
	size = 6,
	keyword = '',
	wardId = '',
	propertyType = '',
	listingType = '',
	legalStatus = '',
	minPrice,
	maxPrice,
	minArea,
	maxArea,
	minBedrooms,
	minBathrooms,
} = {}) => {
	const params = {
		page,
		size,
		...(keyword ? { keyword } : {}),
		...(wardId ? { wardId } : {}),
		...(propertyType ? { propertyType } : {}),
		...(listingType ? { listingType } : {}),
		...(legalStatus ? { legalStatus } : {}),
		...(minPrice !== undefined ? { minPrice } : {}),
		...(maxPrice !== undefined ? { maxPrice } : {}),
		...(minArea !== undefined ? { minArea } : {}),
		...(maxArea !== undefined ? { maxArea } : {}),
		...(minBedrooms !== undefined ? { minBedrooms } : {}),
		...(minBathrooms !== undefined ? { minBathrooms } : {}),
	};

	const hasKeyword = Boolean(keyword);
	const hasAnyFilter = Boolean(
		wardId ||
		propertyType ||
		listingType ||
		legalStatus ||
		minPrice !== undefined ||
		maxPrice !== undefined ||
		minArea !== undefined ||
		maxArea !== undefined ||
		minBedrooms !== undefined ||
		minBathrooms !== undefined,
	);
	const useFilteredEndpoint = hasKeyword || hasAnyFilter;
	const requestUrl = useFilteredEndpoint ? `${POST_BASE_URL}/search` : `${POST_BASE_URL}/all`;

	logPostService('Request getAllPosts', { requestUrl, params });

	try {
		const response = await axios.get(requestUrl, {
			params,
		});

		logPostService('Response getAllPosts', {
			httpStatus: response.status,
			code: response.data?.code,
			currentPage: response.data?.result?.currentPage,
			totalPages: response.data?.result?.totalPages,
			items: response.data?.result?.data?.length || 0,
		});

		return response;
	} catch (error) {
		logPostService('Error getAllPosts', {
			httpStatus: error.response?.status,
			code: error.response?.data?.code,
			message: error.response?.data?.message || error.message,
			requestUrl,
			params,
		});
		throw error;
	}
};

// Lay danh sach bai dang cua chinh nguoi dung dang dang nhap.
export const getMyPosts = async ({
	keyword = '',
	status = '',
	page = 1,
	size = 6,
	accessToken,
} = {}) => {
	const requestUrl = `${POST_BASE_URL}/my-posts`;
	const token = accessToken || localStorage.getItem('accessToken');

	if (!token) {
		const noTokenError = new Error('Thiếu accessToken để lấy danh sách tin của bạn.');
		noTokenError.code = 'NO_ACCESS_TOKEN';
		throw noTokenError;
	}

	const params = {
		page,
		size,
		...(keyword ? { keyword } : {}),
		...(status ? { status } : {}),
	};

	logPostService('Request getMyPosts', {
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

		logPostService('Response getMyPosts', {
			httpStatus: response.status,
			code: response.data?.code,
			currentPage: response.data?.result?.currentPage,
			totalPages: response.data?.result?.totalPages,
			items: response.data?.result?.data?.length || 0,
		});

		return response;
	} catch (error) {
		logPostService('Error getMyPosts', {
			httpStatus: error.response?.status,
			code: error.response?.data?.code || error.code,
			message: error.response?.data?.message || error.message,
			requestUrl,
			params,
			hasAccessToken: Boolean(token),
		});
		throw error;
	}
};

// Lay chi tiet bai dang theo id, tu dong kem Bearer token neu dang co dang nhap.
export const getPostDetail = async (postId, accessToken) => {
	const requestUrl = `${POST_BASE_URL}/${postId}`;
	const token = accessToken || localStorage.getItem('accessToken');
	const config = token
		? {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
		: undefined;

	logPostService('Request getPostDetail', {
		requestUrl,
		postId,
		hasAccessToken: Boolean(token),
	});

	try {
		const response = await axios.get(requestUrl, config);
		logPostService('Response getPostDetail', {
			httpStatus: response.status,
			code: response.data?.code,
			postId: response.data?.result?.id,
			title: response.data?.result?.title,
		});
		return response;
	} catch (error) {
		logPostService('Error getPostDetail', {
			httpStatus: error.response?.status,
			code: error.response?.data?.code,
			message: error.response?.data?.message || error.message,
			requestUrl,
			postId,
			hasAccessToken: Boolean(token),
		});
		throw error;
	}
};

// Toggle trang thai yeu thich cho bai dang; bat buoc co Bearer token.
export const togglePostFavorite = async (postId, accessToken) => {
	const requestUrl = `${POST_BASE_URL}/${postId}/favorite`;
	const token = accessToken || localStorage.getItem('accessToken');

	if (!token) {
		const noTokenError = new Error('Thiếu accessToken cho thao tác yêu thích.');
		noTokenError.code = 'NO_ACCESS_TOKEN';
		throw noTokenError;
	}

	const config = token
		? {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
		: undefined;

	logPostService('Request togglePostFavorite', {
		requestUrl,
		postId,
		hasAccessToken: Boolean(token),
	});

	try {
		const response = await axios.post(requestUrl, null, config);
		logPostService('Response togglePostFavorite', {
			httpStatus: response.status,
			code: response.data?.code,
			message: response.data?.message,
			postId,
		});
		return response;
	} catch (error) {
		logPostService('Error togglePostFavorite', {
			httpStatus: error.response?.status,
			code: error.response?.data?.code,
			message: error.response?.data?.message || error.message,
			requestUrl,
			postId,
			hasAccessToken: Boolean(token),
		});
		throw error;
	}
};

// Ghi nhan hanh dong lien he cua nguoi dung voi bai dang.
export const recordPostContact = async (postId, accessToken) => {
	const requestUrl = `${POST_BASE_URL}/${postId}/contact`;
	const token = accessToken || localStorage.getItem('accessToken');

	if (!token) {
		const noTokenError = new Error('Thiếu accessToken cho thao tác liên hệ.');
		noTokenError.code = 'NO_ACCESS_TOKEN';
		throw noTokenError;
	}

	const config = token
		? {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
		: undefined;

	logPostService('Request recordPostContact', {
		requestUrl,
		postId,
		hasAccessToken: Boolean(token),
	});

	try {
		const response = await axios.post(requestUrl, null, config);
		logPostService('Response recordPostContact', {
			httpStatus: response.status,
			code: response.data?.code,
			message: response.data?.message,
			postId,
		});
		return response;
	} catch (error) {
		logPostService('Error recordPostContact', {
			httpStatus: error.response?.status,
			code: error.response?.data?.code,
			message: error.response?.data?.message || error.message,
			requestUrl,
			postId,
			hasAccessToken: Boolean(token),
		});
		throw error;
	}
};

// Tao bai dang moi; bat buoc co Bearer token va body theo PostCreateRequest.
export const createPost = async (payload, accessToken) => {
	const requestUrl = `${POST_BASE_URL}/create`;
	const token = accessToken || localStorage.getItem('accessToken');

	if (!token) {
		const noTokenError = new Error('Thiếu accessToken cho thao tác đăng tin.');
		noTokenError.code = 'NO_ACCESS_TOKEN';
		throw noTokenError;
	}

	logPostService('Request createPost', {
		requestUrl,
		hasAccessToken: Boolean(token),
		propertyType: payload?.propertyType,
		listingType: payload?.listingType,
		wardId: payload?.wardId,
		galleryCount: Array.isArray(payload?.imageUrls) ? payload.imageUrls.length : 0,
	});

	try {
		const response = await axios.post(requestUrl, payload, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		logPostService('Response createPost', {
			httpStatus: response.status,
			code: response.data?.code,
			message: response.data?.message,
		});
		return response;
	} catch (error) {
		logPostService('Error createPost', {
			httpStatus: error.response?.status,
			code: error.response?.data?.code || error.code,
			message: error.response?.data?.message || error.message,
			requestUrl,
			hasAccessToken: Boolean(token),
		});
		throw error;
	}
};
