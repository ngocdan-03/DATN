import { privateClient } from "./axiosClients";

async function getMyInfo() {
    try {
        const response = await privateClient.get("/users/my-info");

        const data = response?.data;

        if (!data || data.code !== 1000) {
            const err = new Error(data?.message || "Lấy thông tin cá nhân thất bại");
            err.code = data?.code;
            throw err;
        }

        return {
            code: data.code,
            message: data.message || "Lấy thông tin cá nhân thành công",
            result: data.result,
        };
    } catch (error) {
        // Xử lý lỗi từ phía Server trả về
        const apiCode = error?.response?.data?.code;
        const apiMessage = error?.response?.data?.message;

        const err = new Error(
            apiMessage || error?.message || "Lấy thông tin cá nhân thất bại"
        );
        err.code = apiCode;
        throw err;
    }
}

async function changePassword(payload) {
    try {
        const response = await privateClient.post("/users/change-password", {
            oldPassword: payload.oldPassword,
            newPassword: payload.newPassword,
        });

        const data = response?.data;

        if (!data || data.code !== 1000) {
            const err = new Error(data?.message || "Thay đổi mật khẩu thất bại");
            err.code = data?.code;
            throw err;
        }

        return {
            code: data.code,
            message: data.message || "Thay đổi mật khẩu thành công!",
        };
    } catch (error) {
        const apiCode = error?.response?.data?.code;
        const apiMessage = error?.response?.data?.message;

        const err = new Error(
            apiMessage || error?.message || "Thay đổi mật khẩu thất bại"
        );
        err.code = apiCode;
        throw err;
    }
}

async function uploadAvatar(file) {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await privateClient.post("/users/upload-avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        const data = response?.data;
        if (!data || data.code !== 1000) {
            const err = new Error(data?.message || "Upload ảnh thất bại");
            err.code = data?.code;
            throw err;
        }

        return data; // Trả về { code, message, result: "url_anh" }
    } catch (error) {
        const apiMessage = error?.response?.data?.message;
        const err = new Error(apiMessage || "Lỗi kết nối server khi upload ảnh");
        throw err;
    }
}

async function updateMyInfo(payload) {
    try {
        const response = await privateClient.put("/users/update-myInfo", payload);

        const data = response?.data;
        if (!data || data.code !== 1000) {
            const err = new Error(data?.message || "Cập nhật thông tin thất bại");
            err.code = data?.code;
            throw err;
        }

        return data; // Trả về { code, message, result: { user_data } }
    } catch (error) {
        const apiMessage = error?.response?.data?.message;
        const err = new Error(apiMessage || "Lỗi kết nối server khi cập nhật thông tin");
        throw err;
    }
}

export const userService = {
    getMyInfo,
    changePassword,
    uploadAvatar,
    updateMyInfo,
};