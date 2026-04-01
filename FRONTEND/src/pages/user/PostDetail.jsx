import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import StateCard from '../../components/common/StateCard';
import BackLink from '../../components/user/news/detail/BackLink';
import PostDescription from '../../components/user/post/detail/PostDescription';
import PostDetailHeader from '../../components/user/post/detail/PostDetailHeader';
import PostImageGallery from '../../components/user/post/detail/PostImageGallery';
import PostOverview from '../../components/user/post/detail/PostOverview';
import PostOwnerCard from '../../components/user/post/detail/PostOwnerCard';
import { LEGAL_STATUS_LABELS, LISTING_LABELS, PROPERTY_LABELS } from '../../constants/postFilters';
import { getPostDetail, recordPostContact, togglePostFavorite } from '../../services/postService';
import { emitAuthRequired } from '../../services/authUiEvents';
import { createLogger } from '../../utils/logger';

const logPostDetail = createLogger('PostDetail');
const BACKEND_ORIGIN = 'http://localhost:8080';
const FALLBACK_IMAGE =
	'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';
const FALLBACK_OWNER_AVATAR =
	'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop';

const LOCAL_POST_IMAGES = import.meta.glob('../../assets/posts/*.{png,jpg,jpeg,webp,avif}', {
	eager: true,
	import: 'default',
});

const LOCAL_USER_IMAGES = import.meta.glob('../../assets/users/*.{png,jpg,jpeg,webp,avif}', {
	eager: true,
	import: 'default',
});

const LOCAL_IMAGE_BY_NAME = {
	...Object.entries(LOCAL_POST_IMAGES).reduce((accumulator, [path, assetUrl]) => {
		const fileName = path.split('/').pop()?.toLowerCase();
		if (fileName) accumulator[fileName] = assetUrl;
		return accumulator;
	}, {}),
	...Object.entries(LOCAL_USER_IMAGES).reduce((accumulator, [path, assetUrl]) => {
		const fileName = path.split('/').pop()?.toLowerCase();
		if (fileName) accumulator[fileName] = assetUrl;
		return accumulator;
	}, {}),
};

const getFileNameFromPath = (pathValue) => {
	if (!pathValue) return '';
	const cleanPath = pathValue.split('?')[0].split('#')[0];
	return cleanPath.split('/').pop()?.toLowerCase() || '';
};

const resolveAssetUrl = (url, fallback = FALLBACK_IMAGE) => {
	if (!url) return fallback;
	if (url.startsWith('http://') || url.startsWith('https://')) return url;

	const fileName = getFileNameFromPath(url);
	if (fileName && LOCAL_IMAGE_BY_NAME[fileName]) return LOCAL_IMAGE_BY_NAME[fileName];
	if (url.startsWith('/')) return `${BACKEND_ORIGIN}${url}`;
	return fallback;
};

const formatCurrencyVND = (amount) => {
	if (typeof amount !== 'number') return 'Liên hệ';
	return `${new Intl.NumberFormat('vi-VN').format(amount)} VNĐ`;
};

const formatArea = (area) => {
	if (typeof area !== 'number') return '--';
	return `${area.toFixed(1).replace('.0', '')} m2`;
};

const safeText = (value, fallback) => {
	return typeof value === 'string' && value.trim() ? value : fallback;
};

const normalizePhone = (phone) => {
	if (typeof phone !== 'string') return '';
	return phone.replace(/\D/g, '');
};

const getCurrentAccessToken = () => localStorage.getItem('accessToken') || '';

// Trang chi tiet bai dang theo id URL /posts/:id.
const PostDetail = () => {
	const { id } = useParams();
	const location = useLocation();
	const { isAuthenticated } = useAuth();
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const [isFavorite, setIsFavorite] = useState(false);
	const [favoriteLoading, setFavoriteLoading] = useState(false);
	const [favoriteError, setFavoriteError] = useState('');

	useEffect(() => {
		const fetchDetail = async () => {
			setLoading(true);
			setError('');
			setPost(null);
			setActiveImageIndex(0);

			logPostDetail('Fetch detail start', { id });

			try {
				const response = await getPostDetail(id);
				if (response.data?.code === 1000 && response.data?.result) {
					setPost(response.data.result);
					setIsFavorite(Boolean(response.data.result.favorite));
					logPostDetail('Fetch detail success', {
						id: response.data.result.id,
						title: response.data.result.title,
					});
					return;
				}

				setError(response.data?.message || 'Không thể tải chi tiết bài đăng.');
			} catch (fetchError) {
				setError(fetchError.response?.data?.message || 'Không thể tải chi tiết bài đăng.');
				logPostDetail('Fetch detail failed', {
					httpStatus: fetchError.response?.status,
					code: fetchError.response?.data?.code,
					message: fetchError.response?.data?.message || fetchError.message,
					id,
				});
			} finally {
				setLoading(false);
			}
		};

		if (!id) {
			setLoading(false);
			setError('ID bài đăng không hợp lệ.');
			return;
		}

		fetchDetail();
	}, [id]);

	const images = useMemo(() => {
		if (!Array.isArray(post?.imageUrls) || !post.imageUrls.length) {
			return [FALLBACK_IMAGE];
		}
		return post.imageUrls.map((imageUrl) => resolveAssetUrl(imageUrl, FALLBACK_IMAGE));
	}, [post]);

	useEffect(() => {
		if (activeImageIndex > images.length - 1) {
			setActiveImageIndex(0);
		}
	}, [activeImageIndex, images.length]);

	const listingTypeLabel = LISTING_LABELS[post?.listingType] || 'Bài đăng';
	const propertyTypeLabel = PROPERTY_LABELS[post?.propertyType] || 'Bất động sản';
	const legalStatusLabel = LEGAL_STATUS_LABELS[post?.legalStatus] || 'Chưa cập nhật pháp lý';

	const ownerPhone = normalizePhone(post?.owner?.phone);
	const ownerEmail = safeText(post?.owner?.email, '');
	const ownerAvatar = resolveAssetUrl(post?.owner?.avatarUrl, FALLBACK_OWNER_AVATAR);

	const contactEmailHref = ownerEmail
		? `mailto:${ownerEmail}?subject=${encodeURIComponent(`Liên hệ bài đăng #${post?.id || ''}`)}&body=${encodeURIComponent(
			`Chào anh/chị, tôi quan tâm đến bài đăng: ${safeText(post?.title, 'Bài đăng bất động sản')}`,
		)}`
		: '#';

	const goToImage = (nextIndex) => {
		setActiveImageIndex((nextIndex + images.length) % images.length);
	};

	const requireAuthForAction = (message) => {
		const token = getCurrentAccessToken();
		if (isAuthenticated && token) {
			return token;
		}

		emitAuthRequired({
			message: message || 'Bạn cần đăng nhập để tiếp tục thao tác này.',
			from: location.pathname,
		});
		return '';
	};

	const handleToggleFavorite = async () => {
		if (!post?.id || favoriteLoading) return;

		const token = requireAuthForAction('Bạn cần đăng nhập để lưu bài đăng yêu thích.');
		if (!token) return;

		setFavoriteError('');
		setFavoriteLoading(true);
		try {
			const response = await togglePostFavorite(post.id, token);
			if (response.data?.code === 1000) {
				setIsFavorite((previous) => !previous);
				logPostDetail('Toggle favorite success', {
					postId: post.id,
					nextFavorite: !isFavorite,
				});
				return;
			}

			setFavoriteError(response.data?.message || 'Không thể lưu bài đăng.');
		} catch (favoriteFetchError) {
			const fallbackMessage = favoriteFetchError.response?.data?.message || 'Không thể lưu bài đăng.';
			setFavoriteError(fallbackMessage);
			logPostDetail('Toggle favorite failed', {
				httpStatus: favoriteFetchError.response?.status,
				code: favoriteFetchError.response?.data?.code || favoriteFetchError.code,
				message: favoriteFetchError.response?.data?.message || favoriteFetchError.message,
				postId: post.id,
			});
		} finally {
			setFavoriteLoading(false);
		}
	};

	const handleContactAction = async (href, destination) => {
		if (!post?.id || !href || href === '#') return;

		const token = requireAuthForAction('Bạn cần đăng nhập để thực hiện liên hệ.');
		if (!token) return;

		try {
			const response = await recordPostContact(post.id, token);
			if (response.data?.code !== 1000) {
				logPostDetail('Record contact returned non-success code', {
					postId: post.id,
					code: response.data?.code,
					message: response.data?.message,
					destination,
				});
			}
		} catch (contactError) {
			logPostDetail('Record contact failed', {
				httpStatus: contactError.response?.status,
				code: contactError.response?.data?.code,
				message: contactError.response?.data?.message || contactError.message,
				postId: post.id,
				destination,
			});
		}

		if (destination === 'zalo') {
			window.open(href, '_blank', 'noopener,noreferrer');
			return;
		}

		window.location.href = href;
	};

	if (loading) {
		return (
			<main className="mx-auto w-full max-w-7xl px-6 pb-16 pt-10 md:px-10">
				<StateCard message="Đang tải chi tiết bài đăng..." className="rounded-3xl border-[#e4e2e3]" />
			</main>
		);
	}

	if (error) {
		return (
			<main className="mx-auto w-full max-w-7xl px-6 pb-16 pt-10 md:px-10">
				<BackLink
					to={-1}
					withWrapper={false}
					className="mb-6 group inline-flex items-center gap-2 text-sm font-semibold text-[#44474c] transition-colors hover:text-[#041627]"
				/>
				<StateCard variant="error" title="Không tải được bài đăng" message={error} className="rounded-3xl" />
			</main>
		);
	}

	if (!post) {
		return null;
	}

	return (
		<main className="mx-auto w-full max-w-7xl px-6 pb-16 pt-10 md:px-10" data-component="DetailPostPage">
			<PostDetailHeader
				title={safeText(post.title, 'Chi tiết bất động sản')}
				displayDate={safeText(post.displayDate, '--/--/----')}
				listingTypeLabel={listingTypeLabel}
				propertyTypeLabel={propertyTypeLabel}
				legalStatusLabel={legalStatusLabel}
			/>

			<section className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]" data-component="MainLayout">
				<div className="space-y-8">
					<PostImageGallery images={images} activeImageIndex={activeImageIndex} onGoToImage={goToImage} />
					<PostOverview
						post={post}
						isFavorite={isFavorite}
						onToggleFavorite={handleToggleFavorite}
						favoriteLoading={favoriteLoading}
						favoriteError={favoriteError}
						formatCurrencyVND={formatCurrencyVND}
						formatArea={formatArea}
						safeText={safeText}
					/>
					<PostDescription description={safeText(post.description, 'Chưa có mô tả cho bài đăng này.')} />
				</div>

				<PostOwnerCard
					owner={post.owner}
					ownerAvatar={ownerAvatar}
					ownerPhone={ownerPhone}
					ownerEmail={ownerEmail}
					contactEmailHref={contactEmailHref}
					onContactZalo={() => handleContactAction(ownerPhone ? `https://zalo.me/${ownerPhone}` : '#', 'zalo')}
					onContactEmail={() => handleContactAction(contactEmailHref, 'email')}
					safeText={safeText}
				/>
			</section>

		</main>
	);
};

export default PostDetail;
