import { privateClient } from "./axiosClients";

async function getAllNews(params) {
  try {
    const response = await privateClient.get("/admin/news", {
      params: {
        keyword: params?.keyword || "",
        category: params?.category || "",
        status: params?.status || "",
        page: params?.page || 1,
        size: params?.size || 6,
      },
    });

    const data = response?.data;
    if (!data || data.code !== 1000) {
      const err = new Error(data?.message || "Lấy danh sách tin tức thất bại");
      err.code = data?.code;
      throw err;
    }

    return {
      code: data.code,
      message: data.message || "Lấy danh sách tin tức thành công",
      result: data.result,
    };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;
    const err = new Error(apiMessage || error?.message || "Lấy danh sách tin tức thất bại");
    err.code = apiCode;
    throw err;
  }
}

async function getNewsDetail(newsId) {
  try {
    const response = await privateClient.get(`/admin/news/${newsId}`);
    const data = response?.data;
    if (!data || data.code !== 1000) {
      const err = new Error(data?.message || "Lấy chi tiết tin tức thất bại");
      err.code = data?.code;
      throw err;
    }
    return {
      code: data.code,
      message: data.message || "Lấy chi tiết tin tức thành công",
      result: data.result,
    };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;
    const err = new Error(apiMessage || error?.message || "Lấy chi tiết tin tức thất bại");
    err.code = apiCode;
    throw err;
  }
}

async function createNews(formData) {
  try {
    const response = await privateClient.post("/admin/news", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const data = response?.data;
    if (!data || data.code !== 1000) {
      const err = new Error(data?.message || "Tạo tin tức thất bại");
      err.code = data?.code;
      throw err;
    }
    return { code: data.code, message: data.message || "Tạo tin tức thành công" };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;
    const err = new Error(apiMessage || error?.message || "Tạo tin tức thất bại");
    err.code = apiCode;
    throw err;
  }
}

async function updateNews(newsId, payload) {
  try {
    const response = await privateClient.put(`/admin/news/${newsId}`, payload);
    const data = response?.data;
    if (!data || data.code !== 1000) {
      const err = new Error(data?.message || "Cập nhật tin tức thất bại");
      err.code = data?.code;
      throw err;
    }
    return { code: data.code, message: data.message || "Cập nhật tin tức thành công" };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;
    const err = new Error(apiMessage || error?.message || "Cập nhật tin tức thất bại");
    err.code = apiCode;
    throw err;
  }
}

async function updateThumbnail(newsId, file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await privateClient.put(`/admin/news/${newsId}/thumbnail`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const data = response?.data;
    if (!data || data.code !== 1000) {
      const err = new Error(data?.message || "Cập nhật ảnh tin tức thất bại");
      err.code = data?.code;
      throw err;
    }
    return { code: data.code, message: data.message || "Cập nhật ảnh tin tức thành công", result: data.result };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;
    const err = new Error(apiMessage || error?.message || "Cập nhật ảnh tin tức thất bại");
    err.code = apiCode;
    throw err;
  }
}

async function hideNews(newsId) {
  try {
    const response = await privateClient.delete(`/admin/news/${newsId}`);
    const data = response?.data;
    if (!data || data.code !== 1000) {
      const err = new Error(data?.message || "Ẩn tin tức thất bại");
      err.code = data?.code;
      throw err;
    }
    return { code: data.code, message: data.message || "Ẩn tin tức thành công" };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;
    const err = new Error(apiMessage || error?.message || "Ẩn tin tức thất bại");
    err.code = apiCode;
    throw err;
  }
}

async function showNews(newsId) {
  try {
    const response = await privateClient.post(`/admin/news/${newsId}/show`);
    const data = response?.data;
    if (!data || data.code !== 1000) {
      const err = new Error(data?.message || "Hiển thị tin tức thất bại");
      err.code = data?.code;
      throw err;
    }
    return { code: data.code, message: data.message || "Hiển thị tin tức thành công" };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;
    const err = new Error(apiMessage || error?.message || "Hiển thị tin tức thất bại");
    err.code = apiCode;
    throw err;
  }
}

export const adminNewsService = {
  getAllNews,
  getNewsDetail,
  createNews,
  updateNews,
  updateThumbnail,
  hideNews,
  showNews,
};