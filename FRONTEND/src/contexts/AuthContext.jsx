/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // lấy thông tin đăng nhập đã lưu (nếu có) khi khởi tạo context
    const stored = authService.getStoredAuth();
    // set các state 
    const [user, setUser] = useState(stored.user);
    const [isAuthenticated, setIsAuthenticated] = useState(stored.isAuthenticated);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // hàm đăng nhập
    const login = useCallback(async (payload) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await authService.login(payload);
            setUser(result.user);
            setIsAuthenticated(Boolean(result.accessToken && result.refreshToken && result.user));
            return result;
        }catch (err) {
            setError(err.message || "đăng nhập thất bại");
            throw err;
        }finally {
            setIsLoading(false);
        }
    },[]);
    // hàm đăng xuất
    const logout = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.logout();
        } catch (err) {
            authService.clearAuthStorage();
            setError(err.message || "đăng xuất thất bại");
            throw err;
        }finally {
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
        }

    },[]);
    // hàm đăng ký
    const register = useCallback(async (payload) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await authService.register(payload);
                return result;
        }catch (err) {
            setError(err.message || "đăng ký thất bại");
            throw err;
        }finally{
            setIsLoading(false);
        }
    }, []);
    // giá trị context sẽ được memo để tránh re-render không cần thiết
    const value = useMemo(() => ({
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        register
    }), [user, isAuthenticated, isLoading, error, login, logout, register]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
    // hàm để sử dụng context trong các component con
    export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth phải được dùng trong component bao bọc bởi AuthProvider");
    }
    return context;
}