/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react';
import { logoutAuth } from '../services/authService';
import { createLogger } from '../utils/logger';

const STORAGE_KEYS = {
	accessToken: 'accessToken',
	refreshToken: 'refreshToken',
	user: 'user',
};
const logAuthContext = createLogger('AuthContext');

// Doc auth state tu localStorage de khoi tao context khi F5.
const readInitialAuth = () => {
	const accessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
	const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
	const rawUser = localStorage.getItem(STORAGE_KEYS.user);

	logAuthContext('Read localStorage on app start', {
		hasAccessToken: Boolean(accessToken),
		hasRefreshToken: Boolean(refreshToken),
		hasUser: Boolean(rawUser),
	});

	if (!accessToken || !refreshToken || !rawUser) {
		return { isAuthenticated: false, user: null };
	}

	try {
		const user = JSON.parse(rawUser);
		logAuthContext('Restored authenticated session', {
			userId: user?.id,
			email: user?.email,
		});
		return { isAuthenticated: true, user };
	} catch {
		logAuthContext('Invalid user JSON in localStorage, clearing session');
		localStorage.removeItem(STORAGE_KEYS.accessToken);
		localStorage.removeItem(STORAGE_KEYS.refreshToken);
		localStorage.removeItem(STORAGE_KEYS.user);
		return { isAuthenticated: false, user: null };
	}
};

export const AuthContext = createContext(null);

// Provider quan ly toan bo trang thai dang nhap trong frontend.
export const AuthProvider = ({ children }) => {
	const initialState = readInitialAuth();
	const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated);
	const [user, setUser] = useState(initialState.user);

	// Luu token + user vao localStorage va cap nhat state sau login thanh cong.
	const login = (payload) => {
		if (!payload?.accessToken || !payload?.refreshToken || !payload?.user) {
			logAuthContext('Skip login state update because payload is incomplete');
			return;
		}

		logAuthContext('Apply login state', {
			userId: payload.user?.id,
			email: payload.user?.email,
			role: payload.user?.role,
		});

		localStorage.setItem(STORAGE_KEYS.accessToken, payload.accessToken);
		localStorage.setItem(STORAGE_KEYS.refreshToken, payload.refreshToken);
		localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(payload.user));

		setIsAuthenticated(true);
		setUser(payload.user);
	};

	// Goi API logout (neu co token) roi luon clear local state de tranh treo phien.
	const logout = async () => {
		const accessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
		logAuthContext('Start logout', { hasAccessToken: Boolean(accessToken) });

		if (accessToken) {
			try {
				await logoutAuth({ accessToken });
				logAuthContext('Logout API success');
			} catch (error) {
				logAuthContext('Logout API failed, continue local cleanup', {
					httpStatus: error.response?.status,
					message: error.response?.data?.message || error.message,
				});
			}
		}

		localStorage.removeItem(STORAGE_KEYS.accessToken);
		localStorage.removeItem(STORAGE_KEYS.refreshToken);
		localStorage.removeItem(STORAGE_KEYS.user);
		setIsAuthenticated(false);
		setUser(null);
		logAuthContext('Logout completed and local state cleared');
	};

	const value = useMemo(
		() => ({ isAuthenticated, user, loading: false, login, logout }),
		[isAuthenticated, user]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook helper de cac component truy cap auth context an toan.
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
