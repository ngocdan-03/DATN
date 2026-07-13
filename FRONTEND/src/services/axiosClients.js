import axios from "axios";

const baseUrl = "http://localhost:8080/real-estate";

// dùng cho api public
export const publicClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// dùng cho api private
export const privateClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Biến dùng để đảm bảo chỉ refresh 1 lần tại 1 thời điểm
let isRefreshing = false;
let refreshPromise = null;

privateClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = "Bearer " + accessToken;
  }
  return config;
});

privateClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Không có response (mất mạng/CORS) thì trả lỗi luôn
    if (!error.response) {
      return Promise.reject(error);
    }

    // Chỉ refresh khi 401, chưa retry, và không phải chính request refresh
    const isUnauthorized = error.response.status === 401;
    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh");

    if (isUnauthorized && !originalRequest?._retry && !isRefreshCall) {
      originalRequest._retry = true;

      try {
        // Nếu đã có request refresh đang chạy thì đợi kết quả đó
        if (!isRefreshing) {
          isRefreshing = true;

          const currentRefreshToken = localStorage.getItem("refreshToken");
          if (!currentRefreshToken) {
            throw new Error("không có refresh token, vui lòng đăng nhập lại");
          }

          refreshPromise = publicClient
            .post("/auth/refresh", { refreshToken: currentRefreshToken })
            .then((res) => {
              const result = res.data?.result || {};
              const newAccessToken = result.accessToken;
              const newRefreshToken = result.refreshToken;

              if (!newAccessToken) {
                throw new Error("Không nhận được access token mới, vui lòng đăng nhập lại");
              }

              localStorage.setItem("accessToken", newAccessToken);
              if (newRefreshToken) {
                localStorage.setItem("refreshToken", newRefreshToken);
              }

              console.log("Token đã được làm mới");

              return newAccessToken;
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        const latestAccessToken = await refreshPromise;

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = "Bearer " + latestAccessToken;

        return privateClient(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);