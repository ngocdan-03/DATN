import axios from 'axios';
import { createLogger } from '../utils/logger';

const NEWS_BASE_URL = 'http://localhost:8080/real-estate/news';
const logNewsService = createLogger('NewsService');

// Lay danh sach tin tuc theo trang, ho tro tim kiem voi keyword va category.
export const getAllNews = async ({ page = 1, size = 6, keyword = '', category = '' }) => {
	const normalizedKeyword = keyword.trim();
	const normalizedCategory = category.trim().toUpperCase();
	logNewsService('Request getAllNews', { page, size, keyword: normalizedKeyword, category: normalizedCategory });

	try {
		const response = await axios.get(`${NEWS_BASE_URL}/all`, {
			params: {
				page,
				size,
				...(normalizedKeyword ? { keyword: normalizedKeyword } : {}),
				...(normalizedCategory ? { category: normalizedCategory } : {}),
			},
		});

		logNewsService('Response getAllNews', {
			httpStatus: response.status,
			code: response.data?.code,
			keyword: normalizedKeyword,
			category: normalizedCategory,
			currentPage: response.data?.result?.currentPage,
			totalPages: response.data?.result?.totalPages,
			items: response.data?.result?.data?.length || 0,
		});

		return response;
	} catch (error) {
		logNewsService('Error getAllNews', {
			httpStatus: error.response?.status,
			code: error.response?.data?.code,
			message: error.response?.data?.message || error.message,
			page,
			size,
			keyword: normalizedKeyword,
			category: normalizedCategory,
		});
		throw error;
	}
};

// Lay chi tiet mot tin tuc theo id.
export const getNewsDetail = async (id) => {
	logNewsService('Request getNewsDetail', { id });

	try {
		const response = await axios.get(`${NEWS_BASE_URL}/${id}`);

		logNewsService('Response getNewsDetail', {
			httpStatus: response.status,
			code: response.data?.code,
			id: response.data?.result?.id,
			title: response.data?.result?.title,
		});

		return response;
	} catch (error) {
		logNewsService('Error getNewsDetail', {
			httpStatus: error.response?.status,
			code: error.response?.data?.code,
			message: error.response?.data?.message || error.message,
			id,
		});
		throw error;
	}
};
