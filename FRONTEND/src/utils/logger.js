const REDACTED = '[redacted]';

const SENSITIVE_KEYS = new Set([
	'password',
	'newpassword',
	'accesstoken',
	'refreshtoken',
	'idtoken',
	'token',
	'authorization',
	'email',
	'phone',
	'code',
	'otp',
	'otpcode',
	'secret',
	'clientsecret',
	'apikey',
	'xapikey',
	'cookie',
	'sessionid',
]);

const LOG_LEVEL_PRIORITY = {
	debug: 10,
	info: 20,
	warn: 30,
	error: 40,
	none: 99,
};

const MAX_DEPTH = 4;

const isPlainObject = (value) => {
	return Object.prototype.toString.call(value) === '[object Object]';
};

const maskEmail = (value) => {
	if (typeof value !== 'string') return REDACTED;
	const [localPart, domainPart] = value.split('@');
	if (!localPart || !domainPart) return REDACTED;
	if (localPart.length <= 2) return `${localPart[0] || '*'}***@${domainPart}`;
	return `${localPart.slice(0, 2)}***@${domainPart}`;
};

const sanitizeByKey = (key, value) => {
	const normalizedKey = String(key || '').toLowerCase();
	if (!SENSITIVE_KEYS.has(normalizedKey)) return value;
	if (normalizedKey === 'email') return maskEmail(value);
	if (normalizedKey === 'phone') return REDACTED;
	if (normalizedKey === 'code' || normalizedKey === 'otp' || normalizedKey === 'otpcode') return '[otp-hidden]';
	if (typeof value === 'string') return `[hidden:${value.length}]`;
	return REDACTED;
};

const sanitizeValue = (value, depth = 0) => {
	if (depth > MAX_DEPTH) return '[max-depth]';
	if (value === null || value === undefined) return value;

	if (Array.isArray(value)) {
		return value.map((item) => sanitizeValue(item, depth + 1));
	}

	if (isPlainObject(value)) {
		return Object.entries(value).reduce((accumulator, [key, rawValue]) => {
			const sanitizedLeaf = sanitizeByKey(key, rawValue);
			accumulator[key] = sanitizedLeaf === rawValue ? sanitizeValue(rawValue, depth + 1) : sanitizedLeaf;
			return accumulator;
		}, {});
	}

	return value;
};

const resolveIsEnabled = () => {
	if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_LOG_ENABLED !== undefined) {
		return String(import.meta.env.VITE_LOG_ENABLED).toLowerCase() === 'true';
	}

	if (typeof import.meta !== 'undefined' && import.meta.env) {
		return Boolean(import.meta.env.DEV);
	}

	return false;
};

const resolveGlobalLevel = () => {
	const rawLevel =
		typeof import.meta !== 'undefined' && import.meta.env?.VITE_LOG_LEVEL
			? String(import.meta.env.VITE_LOG_LEVEL)
			: 'info';
	const normalizedLevel = rawLevel.toLowerCase();
	return LOG_LEVEL_PRIORITY[normalizedLevel] ? normalizedLevel : 'info';
};

const resolveConsoleMethod = (level) => {
	if (level === 'error') return console.error;
	if (level === 'warn') return console.warn;
	if (level === 'debug') return console.debug;
	return console.info;
};

// Tao logger theo scope de thay cho console.log rai rac va tu dong sanitize du lieu nhay cam.
export const createLogger = (
	scope,
	{ enabled = resolveIsEnabled(), sanitize = true, level = resolveGlobalLevel() } = {},
) => {
	const prefix = `[${scope}]`;
	const minPriority = LOG_LEVEL_PRIORITY[level] || LOG_LEVEL_PRIORITY.info;

	const writeLog = (message, data, logLevel = 'info') => {
		const normalizedLevel = String(logLevel || 'info').toLowerCase();
		const logPriority = LOG_LEVEL_PRIORITY[normalizedLevel] || LOG_LEVEL_PRIORITY.info;
		if (!enabled || logPriority < minPriority) return;

		const printer = resolveConsoleMethod(normalizedLevel);
		if (data === undefined) {
			printer(prefix, message);
			return;
		}

		const payload = sanitize ? sanitizeValue(data) : data;
		printer(prefix, message, payload);
	};

	writeLog.debug = (message, data) => writeLog(message, data, 'debug');
	writeLog.info = (message, data) => writeLog(message, data, 'info');
	writeLog.warn = (message, data) => writeLog(message, data, 'warn');
	writeLog.error = (message, data) => writeLog(message, data, 'error');

	return writeLog;
};
