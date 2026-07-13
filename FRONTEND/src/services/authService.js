import { publicClient } from "./axiosClients";
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "currentUser";

// hàm lưu kết quả đăng nhập vào localStorage
function saveAuthToStorage(result) {
    if(result?.accessToken){
        localStorage.setItem(ACCESS_TOKEN_KEY, result.accessToken);
    }
    if(result?.refreshToken){
        localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
    }
    if(result?.user){
        localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    }
}

// hàm xóa thông tin đăng nhập khỏi localStorage
function clearAuthStorage() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

// hàm lấy thông tin đăng nhập từ localStorage
function getStoredAuth() {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    let user = null;
    try {
        user = userRaw ? JSON.parse(userRaw) : null;
    } catch{
        user = null;
    }
    return {
        accessToken,
        refreshToken,
        user,
        isAuthenticated: Boolean(accessToken && refreshToken && user),
    };
}

// hàm đăng nhập
async function login(payload) {
  try {
    const response = await publicClient.post("/auth/login", {
      email: payload.email,
      password: payload.password,
    });

    const data = response?.data;
    if (!data || data?.code !== 1000) {
      const err = new Error(data?.message || "đăng nhập thất bại");
      err.code = data?.code;
      throw err;
    }

    const result = data.result || {};
    if (!result.accessToken || !result.refreshToken) {
      throw new Error("Thiếu token trong phản hồi đăng nhập");
    }
    if (!result.user) {
      throw new Error("Thiếu user trong phản hồi đăng nhập");
    }

    saveAuthToStorage(result);

    return {
      user: result.user || null,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      isAuthenticated: Boolean(result.accessToken && result.refreshToken && result.user),
      message: data.message,
    };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;

    const err = new Error(apiMessage || error?.message || "đăng nhập thất bại");
    err.code = apiCode;
    throw err;
  }
}
// hàm đăng xuất
async function logout() {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if(accessToken){
        const response = await publicClient.post("/auth/logout", {
            accessToken,
        });

        const data = response?.data;
        if(!data || data?.code !== 1000){
            throw new Error(data?.message || "đăng xuất thất bại");
        }
    }
    // xóa thông tin đăng nhập khỏi storage
    clearAuthStorage();
    return true;
}

// hàm đăng ký
async function register(payload) {
    const response = await publicClient.post("/auth/register", {
        fullName: payload.fullName,
        email: payload.email,
        password: payload.password,
        phone: payload.phone,
    });
    const data = response?.data;
    if(!data || data?.code !== 1000){
        throw new Error(data?.message || "đăng ký thất bại");
    }
    return {
        isAuthenticated: false,
        message: data.message || "đăng ký thành công",
    };
}

// hàm lấy otp xác thực tài khoản
async function sendOtpVerify(payload) {
  try {
    const response = await publicClient.post("/auth/send-otp-verify", {
      email: payload.email,
    });

    const data = response?.data;
    if (!data || data?.code !== 1000) {
      const err = new Error(data?.message || "gửi OTP thất bại");
      err.code = data?.code;
      throw err;
    }

    return {
      code: data.code,
      message: data.message || "gửi OTP thành công",
    };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;

    const err = new Error(apiMessage || error?.message || "gửi OTP thất bại");
    err.code = apiCode;
    throw err;
  }
}

// hàm xác thực tài khoản
async function verifyAccount(payload) {
  try {
    const response = await publicClient.post("/auth/verify-account", {
      email: payload.email,
      code: payload.code,
    });

    const data = response?.data;
    if (!data || data?.code !== 1000) {
      const err = new Error(data?.message || "xác thực tài khoản thất bại");
      err.code = data?.code;
      throw err;
    }

    return {
      code: data.code,
      message: data.message || "xác thực tài khoản thành công",
    };
  } catch (error) {
    const apiCode = error?.response?.data?.code;
    const apiMessage = error?.response?.data?.message;

    const err = new Error(apiMessage || error?.message || "xác thực tài khoản thất bại");
    err.code = apiCode;
    throw err;
  }
}

// hàm gửi otp quên mật khẩu
async function forgotPassword(payload) {
    try {
      const response = await publicClient.post("/auth/forgot-password", {
        email: payload.email,
      });
      const data = response?.data;
      if (!data || data?.code !== 1000) {
        const err = new Error(data?.message || "gửi OTP quên mật khẩu thất bại");
        err.code = data?.code;
        throw err;
      }
      return {
        code: data.code,
        message: data.message || "gửi OTP quên mật khẩu thành công",
      };
    }catch(error){
      const apiCode = error?.response?.data?.code;
      const apiMessage = error?.response?.data?.message;
      const err = new Error(apiMessage || error?.message || "gửi OTP quên mật khẩu thất bại");
      err.code = apiCode;
      throw err;
    }
}

// hàm đặt lại mật khẩu
async function resetPassword(payload) {
    try {
      const response = await publicClient.post("/auth/reset-password", {
        email: payload.email,
        code: payload.code,
        newPassword: payload.newPassword,
      });

      const data = response?.data;
      if (!data || data?.code !== 1000) {
        const err = new Error(data?.message || "đặt lại mật khẩu thất bại");
        err.code = data?.code;
        throw err;
      }
      return {
        code: data.code,
        message: data.message || "đặt lại mật khẩu thành công",
      }
    }catch(error){
      const apiCode = error?.response?.data?.code;
      const apiMessage = error?.response?.data?.message;
      const err = new Error(apiMessage || error?.message || "đặt lại mật khẩu thất bại");
      err.code = apiCode;
      throw err;
    }
}

// export các hàm để sử dụng trong ứng dụng
export const authService = {
    login,
    logout,
    getStoredAuth,
    clearAuthStorage,
    register,
    sendOtpVerify,
    verifyAccount,
    forgotPassword,
    resetPassword,
};


