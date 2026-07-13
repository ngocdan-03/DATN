import { publicClient } from "./axiosClients";  

async function getAllNews({ keyword = "", category = "", size = 6, page = 1 }) {
    try {
        const response = await publicClient.get("/news/all", {
            params: {
                keyword,
                category,
                size,
                page,
            },
        });

        const data = response?.data;
        if (!data || data.code !== 1000) {
            const err = new Error(data?.message || "Lấy danh sách tin tức thất bại");
            err.code = data?.code;
            throw err;
        }
        return {
            code: data?.code,
            message: data?.message || "Lấy danh sách tin tức thành công",
            result: data?.result,
        }
    }catch (error) {
        const apiCode = error?.response?.data?.code;
        const apiMessage = error?.response?.data?.message;
        const err = new Error(apiMessage || error?.message || "Lấy danh sách tin tức thất bại");
        err.code = apiCode;
        throw err;
    }
};

// lấy chi tiết tin tức
async function getNewsDetail(newsId) {
    try {
        const response = await publicClient.get(`/news/${newsId}`);
        const data = response?.data;
        if (!data || data.code !== 1000) {
            const err = new Error(data?.message || "Lấy chi tiết tin tức thất bại");
            err.code = data?.code;
            throw err;
        }
        return {
            code: data?.code,
            message: data?.message || "Lấy chi tiết tin tức thành công",
            result: data?.result,
        }
    }catch (error) {
        const apiCode = error?.response?.data?.code;
        const apiMessage = error?.response?.data?.message;
        const err = new Error(apiMessage || error?.message || "Lấy chi tiết tin tức thất bại");
        err.code = apiCode;
        throw err;
    }
}

export const newsService = {
    getAllNews,
    getNewsDetail,
}