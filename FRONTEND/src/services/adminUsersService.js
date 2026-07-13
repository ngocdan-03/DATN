import { privateClient } from "./axiosClients";

async function getUsers(params) {
  try {
    const response = await privateClient.get("/admin/users", {
      params: {
        keyword: params?.keyword || "",
        isVerified: params?.isVerified === "" ? undefined : params?.isVerified,
        isLocked: params?.isLocked === "" ? undefined : params?.isLocked,
        page: params?.page || 1,
        size: params?.size || 6,
      },
    });

    const data = response?.data;
    if (!data || data.code !== 1000) {
      const err = new Error(data?.message || "Lấy danh sách user thất bại");
      err.code = data?.code;
      throw err;
    }

    return {
      code: data.code,
      message: data.message || "Lấy danh sách user thành công",
      result: data.result,
    };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;
    const err = new Error(apiMessage || error?.message || "Lấy danh sách user thất bại");
    err.code = apiCode;
    throw err;
  }
}

async function getUserDetail(userId, params) {
  try {
    const response = await privateClient.get(`/admin/users/${userId}`, {
      params: {
        page: params?.page || 1,
        size: params?.size || 5,
      },
    });

    const data = response?.data;
    if (!data || data.code !== 1000) {
      const err = new Error(data?.message || "Lấy chi tiết user thất bại");
      err.code = data?.code;
      throw err;
    }

    return {
      code: data.code,
      message: data.message || "Lấy chi tiết user thành công",
      result: data.result,
    };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;
    const err = new Error(apiMessage || error?.message || "Lấy chi tiết user thất bại");
    err.code = apiCode;
    throw err;
  }
}

async function toggleLock(userId) {
  try {
    const response = await privateClient.post(`/admin/users/${userId}/toggle-lock`);
    const data = response?.data;

    if (!data || data.code !== 1000) {
      const err = new Error(data?.message || "Cập nhật trạng thái tài khoản thất bại");
      err.code = data?.code;
      throw err;
    }

    return {
      code: data.code,
      message: data.message || "Cập nhật trạng thái tài khoản thành công",
    };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;
    const err = new Error(apiMessage || error?.message || "Cập nhật trạng thái tài khoản thất bại");
    err.code = apiCode;
    throw err;
  }
}

export const adminUsersService = {
  getUsers,
  getUserDetail,
  toggleLock,
};