import { privateClient } from "./axiosClients";

async function getFinanceSummary(params) {
    try {
        // Dùng privateClient vì thông tin tài chính cần Token xác thực
        const response = await privateClient.get("/finance/summary", {
            params: {
                page: params?.page || 1,
                size: params?.size || 5,
                keyword: params?.keyword || "",
            },
        });

        const data = response?.data;

        // Kiểm tra mã code 1000 theo chuẩn hệ thống của bạn
        if (!data || data.code !== 1000) {
            const err = new Error(data?.message || "Lấy thông tin tài chính thất bại");
            err.code = data?.code;
            throw err;
        }

        return {
            code: data.code,
            message: data.message || "Lấy thông tin tài chính thành công",
            result: data.result, 
            // result sẽ bao gồm: transactions, chartData, totalDeposit6Months, totalSpend6Months
        };
    } catch (error) {
        // Xử lý lỗi từ phía Server trả về
        const apiCode = error?.response?.data?.code;
        const apiMessage = error?.response?.data?.message;

        const err = new Error(
            apiMessage || error?.message || "Lấy thông tin tài chính thất bại"
        );
        err.code = apiCode;
        throw err;
    }
}

async function getTransactionDetail(transactionId) {
    try {
        const response = await privateClient.get(`/finance/transactions/${transactionId}`);

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
            // result sẽ chứa đầy đủ: invoiceNo, customerName, customerPhone, postId, postTitle...
        };
    } catch (error) {
        const apiCode = error?.response?.data?.code;
        const apiMessage = error?.response?.data?.message;

        const err = new Error(
            apiMessage || error?.message || "Lấy chi tiết giao dịch thất bại"
        );
        err.code = apiCode;
        throw err;
    }
}

export const financeService = {
    getFinanceSummary,
    getTransactionDetail,
};