import defaultAvatar from '../assets/default.png';

const LOCAL_USER_IMAGES = import.meta.glob('../assets/users/*.{png,jpg,jpeg,webp,avif}', {
	eager: true,
	import: 'default',
});

const LOCAL_USER_IMAGE_BY_NAME = Object.entries(LOCAL_USER_IMAGES).reduce((accumulator, [path, url]) => {
	const fileName = path.split('/').pop()?.toLowerCase();
	if (fileName) {
		accumulator[fileName] = url;
	}
	return accumulator;
}, {});

const getFileNameFromPath = (pathValue) => {
	if (!pathValue) return '';
	const cleanPath = pathValue.split('?')[0].split('#')[0];
	return cleanPath.split('/').pop()?.toLowerCase() || '';
};

export const resolveUserAvatarUrl = (avatarValue) => {
	if (!avatarValue || avatarValue === 'default.png' || avatarValue === '/assets/default.png') {
		return defaultAvatar;
	}

	if (avatarValue.startsWith('http://') || avatarValue.startsWith('https://')) {
		return avatarValue;
	}

	const fileName = getFileNameFromPath(avatarValue);
	if (fileName && LOCAL_USER_IMAGE_BY_NAME[fileName]) {
		return LOCAL_USER_IMAGE_BY_NAME[fileName];
	}

	if (avatarValue.startsWith('/')) {
		return avatarValue;
	}

	return defaultAvatar;
};

export const FALLBACK_AVATAR_URL = defaultAvatar;
