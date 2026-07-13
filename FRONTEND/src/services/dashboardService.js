import { privateClient } from "./axiosClients";

// hàm lấy dữ liệu tổng quan cho dashboard
async function getOverview() {
    try {
        const response = await privateClient.get("/dashboard/overview");
        const data = response?.data;
        if (!data || data.code !== 1000) {
            const err = new Error(data?.message || "Lấy dữ liệu tổng quan thất bại");
            err.code = data?.code;
            throw err;
        }
        return {
            code: data?.code,
            message: data?.message || "Lấy dữ liệu tổng quan thành công",
            overview: data?.result,
        }
    }catch (error) {
        const apiCode = error?.response?.data?.code;
        const apiMessage = error?.response?.data?.message;
        const err = new Error(apiMessage || error?.message || "Lấy dữ liệu tổng quan thất bại");
        err.code = apiCode;
        throw err;
    }
}

export const dashboardService = {
    getOverview,
};