import { privateClient } from "./axiosClients";

async function createVnpayUrl(payload) {
  try {
    const response = await privateClient.post("/payment/create-vnpay-url", payload);

    const data = response?.data;
    if (!data || data.code !== 1000) {
      const err = new Error(data?.message || "Tạo URL thanh toán thất bại");
      err.code = data?.code;
      throw err;
    }

    const paymentUrl = data?.result?.paymentUrl;
    if (!paymentUrl) {
      throw new Error("Không nhận được paymentUrl từ hệ thống");
    }

    return {
      message: data.message || "Tạo URL thanh toán thành công",
      paymentUrl,
    };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;

    const err = new Error(apiMessage || error?.message || "Tạo URL thanh toán thất bại");
    err.code = apiCode;
    throw err;
  }
}

export const paymentService = {
  createVnpayUrl,
};