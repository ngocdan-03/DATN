import { privateClient } from "./axiosClients";

async function getAllPosts(params) {
  try {
    const response = await privateClient.get("/admin/posts", {
      params: {
        keyword: params?.keyword || "",
        status: params?.status || "",
        wardId: params?.wardId || "",
        propertyType: params?.propertyType || "",
        listingType: params?.listingType || "",
        size: params?.size || 6,
        page: params?.page || 1,
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
      message: data.message || "Lấy danh sách bài đăng thành công",
      result: data.result,
    };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;
    const err = new Error(apiMessage || error?.message || "Lấy danh sách bài đăng thất bại");
    err.code = apiCode;
    throw err;
  }
}

async function approvePost(postId) {
  try {
    const response = await privateClient.post(`/admin/posts/${postId}/approve`);
    const data = response?.data;
    if (!data || data.code !== 1000) {
      const err = new Error(data?.message || "Duyệt bài đăng thất bại");
      err.code = data?.code;
      throw err;
    }
    return { code: data.code, message: data.message || "Duyệt bài đăng thành công" };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;
    const err = new Error(apiMessage || error?.message || "Duyệt bài đăng thất bại");
    err.code = apiCode;
    throw err;
  }
}

async function rejectPost(postId) {
  try {
    const response = await privateClient.post(`/admin/posts/${postId}/reject`);
    const data = response?.data;
    if (!data || data.code !== 1000) {
      const err = new Error(data?.message || "Từ chối bài đăng thất bại");
      err.code = data?.code;
      throw err;
    }
    return { code: data.code, message: data.message || "Từ chối bài đăng thành công" };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;
    const err = new Error(apiMessage || error?.message || "Từ chối bài đăng thất bại");
    err.code = apiCode;
    throw err;
  }
}

async function deletePost(postId) {
  try {
    const response = await privateClient.delete(`/admin/posts/${postId}`);
    const data = response?.data;
    if (!data || data.code !== 1000) {
      const err = new Error(data?.message || "Xóa bài đăng thất bại");
      err.code = data?.code;
      throw err;
    }
    return { code: data.code, message: data.message || "Xóa bài đăng thành công" };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;
    const err = new Error(apiMessage || error?.message || "Xóa bài đăng thất bại");
    err.code = apiCode;
    throw err;
  }
}

export const adminPostsService = {
  getAllPosts,
  approvePost,
  rejectPost,
  deletePost,
};