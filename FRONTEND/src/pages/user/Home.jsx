import { useEffect, useMemo, useState } from 'react';
import HomeHeroSection from '../../components/user/home/HomeHeroSection';
import HomePostGrid from '../../components/user/home/HomePostGrid';
import HomeResultsSummary from '../../components/user/home/HomeResultsSummary';
import HomeResultsToolbar from '../../components/user/home/HomeResultsToolbar';
import NewsPagination from '../../components/user/news/NewsPagination';
import { getAllPosts } from '../../services/postService';
import { createLogger } from '../../utils/logger';
import {
	AREA_OPTIONS,
	AREA_RANGE_TO_QUERY,
	DEFAULT_POST_FILTERS,
	PRICE_RANGE_TO_QUERY,
	AREA_RANGE_OPTIONS,
	LEGAL_STATUS_OPTIONS,
	LISTING_TYPE_OPTIONS,
	PRICE_RANGE_OPTIONS,
	PROPERTY_TYPE_OPTIONS,
	ROOM_COUNT_OPTIONS,
} from '../../constants/postFilters';

const POST_PAGE_SIZE = 6;
const logHome = createLogger('Home');
const BACKEND_ORIGIN = 'http://localhost:8080';
const FALLBACK_THUMBNAIL =
	'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';

const LOCAL_POST_IMAGES = import.meta.glob('../../assets/posts/*.{png,jpg,jpeg,webp,avif}', {
	eager: true,
	import: 'default',
});

const LOCAL_POST_IMAGE_BY_NAME = Object.entries(LOCAL_POST_IMAGES).reduce((accumulator, [path, assetUrl]) => {
	const fileName = path.split('/').pop()?.toLowerCase();
	if (fileName) {
		accumulator[fileName] = assetUrl;
	}
	return accumulator;
}, {});

const getFileNameFromPath = (pathValue) => {
	if (!pathValue) return '';
	const cleanPath = pathValue.split('?')[0].split('#')[0];
	return cleanPath.split('/').pop()?.toLowerCase() || '';
};

const resolveThumbnailUrl = (url) => {
	if (!url) return FALLBACK_THUMBNAIL;
	if (url.startsWith('http://') || url.startsWith('https://')) return url;

	const fileName = getFileNameFromPath(url);
	if (fileName && LOCAL_POST_IMAGE_BY_NAME[fileName]) {
		return LOCAL_POST_IMAGE_BY_NAME[fileName];
	}

	if (url.startsWith('/')) {
		return `${BACKEND_ORIGIN}${url}`;
	}

	return FALLBACK_THUMBNAIL;
};

const formatPrice = (value) => {
	if (typeof value !== 'number') return 'Liên hệ';
	return `${new Intl.NumberFormat('vi-VN').format(value)} VNĐ`;
};

const formatArea = (value) => {
	if (typeof value !== 'number') return '--';
	return `${value.toFixed(1).replace('.0', '')}m2`;
};

const getWardIdFromOption = (optionValue) => {
	const rawValue = (optionValue || '').trim();
	if (!rawValue) return '';

	const matched = rawValue.match(/^(\d{5})\s*-/);
	if (!matched) return '';
	return matched[1];
};

// Trang chu AllPostPage: lay danh sach bai dang va phan trang giong News.
const Home = () => {
	const [page, setPage] = useState(1);
	const [items, setItems] = useState([]);
	const [totalPages, setTotalPages] = useState(1);
	const [totalElements, setTotalElements] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [searchInput, setSearchInput] = useState('');
	const [appliedKeyword, setAppliedKeyword] = useState('');
	const [draftFilters, setDraftFilters] = useState(DEFAULT_POST_FILTERS);
	const [appliedFilters, setAppliedFilters] = useState(DEFAULT_POST_FILTERS);

	const queryParams = useMemo(() => {
		const wardId = getWardIdFromOption(appliedFilters.areaKeyword);
		const priceQuery = PRICE_RANGE_TO_QUERY[appliedFilters.priceRange] || {};
		const areaQuery = AREA_RANGE_TO_QUERY[appliedFilters.areaRange] || {};

		return {
			keyword: appliedKeyword || undefined,
			wardId: wardId || undefined,
			propertyType: appliedFilters.propertyType || undefined,
			listingType: appliedFilters.listingType || undefined,
			legalStatus: appliedFilters.legalStatus || undefined,
			...priceQuery,
			...areaQuery,
			...(appliedFilters.bedrooms ? { minBedrooms: Number(appliedFilters.bedrooms) } : {}),
			...(appliedFilters.bathrooms ? { minBathrooms: Number(appliedFilters.bathrooms) } : {}),
		};
	}, [appliedFilters, appliedKeyword]);

	useEffect(() => {
		const fetchPosts = async () => {
			setLoading(true);
			setError('');
			logHome('Fetch posts start', { page, size: POST_PAGE_SIZE, ...queryParams });

			try {
				const response = await getAllPosts({ page, size: POST_PAGE_SIZE, ...queryParams });
				const result = response.data?.result || {};
				const data = Array.isArray(result.data) ? result.data : [];

				setItems(data);
				setTotalPages(result.totalPages || 1);
				setTotalElements(result.totalElements || data.length);

				logHome('Fetch posts success', {
					queryParams,
					page: result.currentPage || page,
					totalPages: result.totalPages || 1,
					items: data.length,
				});
			} catch (fetchError) {
				setItems([]);
				setTotalElements(0);
				setError(fetchError.response?.data?.message || 'Không thể tải danh sách bài đăng.');
				logHome('Fetch posts failed', {
					httpStatus: fetchError.response?.status,
					code: fetchError.response?.data?.code,
					message: fetchError.response?.data?.message || fetchError.message,
					queryParams,
				});
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, [page, queryParams]);

	const handlePrev = () => {
		if (page <= 1 || loading) return;
		setPage((prevPage) => prevPage - 1);
	};

	const handleNext = () => {
		if (page >= totalPages || loading) return;
		setPage((prevPage) => prevPage + 1);
	};

	const handleSearch = () => {
		const normalizedKeyword = searchInput.trim();
		setPage(1);
		setAppliedKeyword(normalizedKeyword);
		logHome('Apply local search', { keyword: normalizedKeyword });
	};

	const handleDraftFilterChange = (field, value) => {
		setDraftFilters((previous) => ({
			...previous,
			[field]: value,
		}));
	};

	const handleApplyFilters = () => {
		setPage(1);
		setAppliedFilters(draftFilters);
		logHome('Apply backend filters', draftFilters);
	};

	const handleResetFilters = () => {
		setPage(1);
		setDraftFilters(DEFAULT_POST_FILTERS);
		setAppliedFilters(DEFAULT_POST_FILTERS);
		setSearchInput('');
		setAppliedKeyword('');
		logHome('Reset search and backend filters');
	};

	const visibleItems = items;

	const activeFilterCount = useMemo(() => {
		return Object.values(appliedFilters).filter((value) => String(value).trim() !== '').length;
	}, [appliedFilters]);

	const heroImage = LOCAL_POST_IMAGE_BY_NAME['posts1.png'] || FALLBACK_THUMBNAIL;

	return (
		<main className="bg-[linear-gradient(180deg,#f8f6f4_0%,#fbf9fa_35%,#ffffff_100%)]">
			<HomeHeroSection heroImage={heroImage} />

			<HomeResultsToolbar
				searchInput={searchInput}
				onSearchInputChange={setSearchInput}
				onSearch={handleSearch}
				draftFilters={draftFilters}
				onDraftFilterChange={handleDraftFilterChange}
				onApplyFilters={handleApplyFilters}
				onResetFilters={handleResetFilters}
				activeFilterCount={activeFilterCount}
				areaOptions={AREA_OPTIONS}
				propertyTypeOptions={PROPERTY_TYPE_OPTIONS}
				listingTypeOptions={LISTING_TYPE_OPTIONS}
				priceRangeOptions={PRICE_RANGE_OPTIONS}
				areaRangeOptions={AREA_RANGE_OPTIONS}
				legalStatusOptions={LEGAL_STATUS_OPTIONS}
				roomCountOptions={ROOM_COUNT_OPTIONS}
			/>

			<section className="mx-auto w-full max-w-7xl px-6 pb-20 md:px-10">
				<HomeResultsSummary visibleCount={visibleItems.length} pageSize={POST_PAGE_SIZE} totalElements={totalElements} />

				{error && <p className="mb-8 rounded-lg bg-[#ffdad6] px-4 py-3 text-sm text-[#ba1a1a]">{error}</p>}

				<HomePostGrid
					items={visibleItems}
					loading={loading}
					pageSize={POST_PAGE_SIZE}
					resolveThumbnailUrl={resolveThumbnailUrl}
					formatPrice={formatPrice}
					formatArea={formatArea}
				/>

				<NewsPagination
					currentPage={page}
					totalPages={totalPages}
					loading={loading}
					onPrev={handlePrev}
					onNext={handleNext}
				/>
			</section>
		</main>
	);
};

export default Home;
