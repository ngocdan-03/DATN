export const AUTH_REQUIRED_EVENT = 'auth:required';
export const AUTH_SESSION_EXPIRED_EVENT = 'auth:session-expired';

const safeDispatchEvent = (eventName, detail = {}) => {
	if (typeof window === 'undefined') return;
	window.dispatchEvent(new CustomEvent(eventName, { detail }));
};

export const emitAuthRequired = ({
	message = 'Bạn cần đăng nhập để tiếp tục thao tác này.',
	from,
	title = 'Yêu cầu đăng nhập',
} = {}) => {
	safeDispatchEvent(AUTH_REQUIRED_EVENT, { message, from, title });
};

export const emitSessionExpired = ({
	message = 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.',
	title = 'Phiên đăng nhập đã hết hạn',
} = {}) => {
	safeDispatchEvent(AUTH_SESSION_EXPIRED_EVENT, { message, title });
};
