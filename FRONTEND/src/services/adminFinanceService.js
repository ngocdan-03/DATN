import { privateClient } from "./axiosClients";

async function getRevenueSummary(year) {
  try {
    const response = await privateClient.get("/admin/revenue", {
      params: { year },
    });

    const data = response?.data;
    if (!data || data.code !== 1000) {
      const err = new Error(data?.message || "Lấy thống kê doanh thu thất bại");
      err.code = data?.code;
      throw err;
    }

    return {
      code: data.code,
      message: data.message || "Lấy thống kê doanh thu thành công",
      result: data.result,
    };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;
    const err = new Error(apiMessage || error?.message || "Lấy thống kê doanh thu thất bại");
    err.code = apiCode;
    throw err;
  }
}

async function getTransactions(params) {
  try {
    const response = await privateClient.get("/admin/transactions", {
      params: {
        keyword: params?.keyword || "",
        type: params?.type || "",
        status: params?.status || "",
        page: params?.page || 1,
        size: params?.size || 5,
      },
    });

    const data = response?.data;
    if (!data || data.code !== 1000) {
      const err = new Error(data?.message || "Lấy lịch sử giao dịch thất bại");
      err.code = data?.code;
      throw err;
    }

    return {
      code: data.code,
      message: data.message || "Lấy lịch sử giao dịch thành công",
      result: data.result,
    };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;
    const err = new Error(apiMessage || error?.message || "Lấy lịch sử giao dịch thất bại");
    err.code = apiCode;
    throw err;
  }
}

async function getTransactionDetail(transactionId) {
  try {
    const response = await privateClient.get(`/admin/transactions/${transactionId}`);
    const data = response?.data;

    if (!data || data.code !== 1000) {
      const err = new Error(data?.message || "Lấy chi tiết giao dịch thất bại");
      err.code = data?.code;
      throw err;
    }

    return {
      code: data.code,
      message: data.message || "Lấy chi tiết giao dịch thành công",
      result: data.result,
    };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;
    const err = new Error(apiMessage || error?.message || "Lấy chi tiết giao dịch thất bại");
    err.code = apiCode;
    throw err;
  }
}

export const adminFinanceService = {
  getRevenueSummary,
  getTransactions,
  getTransactionDetail,
};