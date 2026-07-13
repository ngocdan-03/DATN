import { publicClient } from "./axiosClients";
import { privateClient } from "./axiosClients";
async function searchPosts(params){
    try {
        const response = await publicClient.get("/posts/search",{
            params: {
                keyword: params.keyword || "",
                wardId: params.wardId || "",
                propertyType: params.propertyType || "",
                listingType: params.listingType || "",
                legalStatus: params.legalStatus || "",
                minPrice: params.minPrice,
                maxPrice: params.maxPrice,
                minArea: params.minArea,
                maxArea: params.maxArea,
                minBedrooms: params.bedrooms || "",
                minBathrooms: params.bathrooms || "",
                page: params.page || 1,
                size: params.size || 6,
            },
        });
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
        };
    } catch (error) {
        const apiCode = error?.response?.data?.code;
        const apiMessage = error?.response?.data?.message;
        const err = new Error(apiMessage || error?.message || "Lấy chi tiết tin tức thất bại");
        err.code = apiCode;
        throw err;
    }
}

async function getPostDetail(postId) {
    try {
        const response = await privateClient.get(`/posts/${postId}`);

        const data = response?.data;
        if (!data || data.code !== 1000) {
            const err = new Error(data?.message || "Lấy chi tiết bài đăng thất bại");
            err.code = data?.code;
            throw err;
        }
        return {
            code: data?.code,
            message: data?.message || "Lấy chi tiết bài đăng thành công",
            result: data?.result,
        };
    }catch (error) {
        const apiCode = error?.response?.data?.code;
        const apiMessage = error?.response?.data?.message;
        const err = new Error(apiMessage || error?.message || "Lấy chi tiết bài đăng thất bại");
        err.code = apiCode;
        throw err;
    }
}

async function toggleFavorite(postId) {
    try {
        const response = await privateClient.post(`/posts/${postId}/favorite`);
        const data = response?.data;
        if (!data || data.code !== 1000) {
            const err = new Error(data?.message || "Toggle favorite thất bại");
            err.code = data?.code;
            throw err;
        }
        return {
            code: data?.code,
            message: data?.message || "Toggle favorite thành công",
        };
    } catch (error) {
        const apiCode = error?.response?.data?.code;
        const apiMessage = error?.response?.data?.message;
        const err = new Error(apiMessage || error?.message || "Toggle favorite thất bại");
        err.code = apiCode;
        throw err;
    }

}

async function trackContact(postId) {
    try {
        const response = await privateClient.post(`/posts/${postId}/contact`);
        const data = response?.data;
        if (!data || data.code !== 1000) {
            const err = new Error(data?.message || "Theo dõi liên hệ thất bại");
            err.code = data?.code;
            throw err;
        }
        return {
            code: data?.code,
            message: data?.message || "Theo dõi liên hệ thành công",
        };
    } catch (error) {
        const apiCode = error?.response?.data?.code;
        const apiMessage = error?.response?.data?.message;
        const err = new Error(apiMessage || error?.message || "Theo dõi liên hệ thất bại");
        err.code = apiCode;
        throw err;
    }
}

async function createPost(formData) {
    try {
        // Dùng privateClient vì đăng tin cần gửi kèm Token
        const response = await privateClient.post("/posts/create", formData,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        const data = response?.data;
        
        if (!data || data.code !== 1000) {
            const err = new Error(data?.message || "Đăng tin thất bại");
            err.code = data?.code;
            throw err;
        }
        return {
            code: data?.code,
            message: data?.message || "Đăng tin thành công",
        };
    } catch (error) {
        const apiCode = error?.response?.data?.code;
        const apiMessage = error?.response?.data?.message;
        const err = new Error(apiMessage || error?.message || "Đăng tin thất bại");
        err.code = apiCode;
        throw err;
    }
}

async function getMyPosts(params) {
    try {
        const response = await privateClient.get("/posts/my-posts", {
            params: {
                keyword: params.keyword || "",
                status: params.status || "",
                page: params.page || 1,
                size: params.size || 6,
            },
        });

        const data = response?.data;

        if (!data || data.code !== 1000) {
            const err = new Error(data?.message || "Lấy danh sách bài đăng thất bại");
            err.code = data?.code;
            throw err;
        }

        return {
            code: data.code,
            message: data.message,
            result: data.result,
        };
    } catch (error) {
        const apiCode = error?.response?.data?.code;
        const apiMessage = error?.response?.data?.message;

        const err = new Error(apiMessage || "Lấy danh sách bài đăng thất bại");
        err.code = apiCode;
        throw err;
    }
}

async function deletePost(postId) {
    try {
        const response = await privateClient.delete(`/posts/${postId}`);

        const data = response?.data;

        if (!data || data.code !== 1000) {
            const err = new Error(data?.message || "Xóa bài đăng thất bại");
            err.code = data?.code;
            throw err;
        }

        return {
            code: data?.code,
            message: data?.message || "Xóa bài đăng thành công",
        };
    } catch (error) {
        const apiCode = error?.response?.data?.code;
        const apiMessage = error?.response?.data?.message;

        const err = new Error(
            apiMessage || error?.message || "Xóa bài đăng thất bại"
        );
        err.code = apiCode;
        throw err;
    }
}

async function getSavedPosts(params) {
    try {
        const response = await privateClient.get("/posts/saved", {
            params: {
                keyword: params?.keyword || "",
                page: params?.page || 1,
                size: params?.size || 5,
            },
        });

        const data = response?.data;

        if (!data || data.code !== 1000) {
            const err = new Error(data?.message || "Lấy danh sách bài đăng đã lưu thất bại");
            err.code = data?.code;
            throw err;
        }

        return {
            code: data.code,
            message: data.message || "Lấy danh sách bài đăng đã lưu thành công",
            result: data.result,
        };
    } catch (error) {
        const apiCode = error?.response?.data?.code;
        const apiMessage = error?.response?.data?.message;

        const err = new Error(
            apiMessage || error?.message || "Lấy danh sách bài đăng đã lưu thất bại"
        );
        err.code = apiCode;
        throw err;
    }
}

async function getPostDetailsForEdit(postId) {
    try {
        // Sử dụng privateClient vì cần Token để BE kiểm tra quyền sở hữu bài đăng
        const response = await privateClient.get(`/posts/my-posts/${postId}/edit-details`);

        const data = response?.data;

        if (!data || data.code !== 1000) {
            const err = new Error(data?.message || "Lấy thông tin chỉnh sửa thất bại");
            err.code = data?.code;
            throw err;
        }

        return {
            code: data.code,
            message: data.message || "Lấy thông tin chỉnh sửa thành công",
            result: data.result,
        };
    } catch (error) {
        const apiCode = error?.response?.data?.code;
        const apiMessage = error?.response?.data?.message;

        const err = new Error(
            apiMessage || error?.message || "Lỗi khi lấy thông tin bài đăng để chỉnh sửa"
        );
        err.code = apiCode;
        throw err;
    }
}

async function updatePost(postId, formData) {
    try {
        const response = await privateClient.put(`/posts/my-posts/${postId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        const data = response?.data;
        if (!data || data.code !== 1000) {
            const err = new Error(data?.message || 'Cập nhật thất bại');
            err.code = data?.code;
            throw err;
        }
        return { code: data.code, message: data.message };
    } catch (error) {
        const apiCode = error?.response?.data?.code;
        const apiMessage = error?.response?.data?.message;
        const err = new Error(apiMessage || error?.message || 'Cập nhật thất bại');
        err.code = apiCode;
        throw err;
    }
}

async function getPersonalRecommendations() {
    try {
        const response = await privateClient.post("/recommend/personal");
        const data = response?.data;

        if (!data || data.code !== 1000) {
            const err = new Error(data?.message || "Lấy gợi ý bất động sản thất bại");
            err.code = data?.code;
            throw err;
        }

        return {
            code: data.code,
            message: data.message || "Lấy gợi ý bất động sản thành công",
            result: {
                posts: data?.result?.posts || [],
                topView: Boolean(data?.result?.topView),
            },
        };
    } catch (error) {
        const apiCode = error?.response?.data?.code;
        const apiMessage = error?.response?.data?.message;
        const err = new Error(apiMessage || error?.message || "Lấy gợi ý bất động sản thất bại");
        err.code = apiCode;
        throw err;
    }
}

async function getSimilarRecommendations(postId) {
    try {
        const response = await publicClient.post(`/recommend/similar/${postId}`);
        const data = response?.data;

        if (!data || data.code !== 1000) {
            const err = new Error(data?.message || "Lấy gợi ý bài đăng tương tự thất bại");
            err.code = data?.code;
            throw err;
        }

        return {
            code: data.code,
            message: data.message || "Lấy gợi ý bài đăng tương tự thành công",
            result: {
                posts: data?.result?.posts || [],
                topView: false,
            },
        };
    } catch (error) {
        const apiCode = error?.response?.data?.code;
        const apiMessage = error?.response?.data?.message;
        const err = new Error(apiMessage || error?.message || "Lấy gợi ý bài đăng tương tự thất bại");
        err.code = apiCode;
        throw err;
    }
}

export const postsService = {
    searchPosts,
    getPostDetail,
    toggleFavorite,
    trackContact,
    createPost,
    getMyPosts,
    deletePost,
    getSavedPosts,
    getPostDetailsForEdit,
    updatePost,
    getPersonalRecommendations,
    getSimilarRecommendations,
}