import { privateClient } from "./axiosClients";

async function getOverview(year) {
  try {
    const response = await privateClient.get("/admin/dashboard", {
      params: { year },
    });

    const data = response?.data;
    if (!data || data.code !== 1000) {
      const err = new Error(data?.message || "Lấy dashboard admin thất bại");
      err.code = data?.code;
      throw err;
    }

    return {
      code: data.code,
      message: data.message || "Lấy dashboard admin thành công",
      result: data.result,
    };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;
    const err = new Error(apiMessage || error?.message || "Lấy dashboard admin thất bại");
    err.code = apiCode;
    throw err;
  }
}

export const adminDashboardService = {
  getOverview,
};