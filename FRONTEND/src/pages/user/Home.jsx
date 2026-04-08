import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import HomeHeroSection from '../../components/user/home/HomeHeroSection';
import HomePostGrid from '../../components/user/home/HomePostGrid';
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

const HOME_FILTER_QUERY_KEYS = {
	areaKeyword: 'areaKeyword',
	propertyType: 'propertyType',
	listingType: 'listingType',
	priceRange: 'priceRange',
	areaRange: 'areaRange',
	legalStatus: 'legalStatus',
	bedrooms: 'bedrooms',
	bathrooms: 'bathrooms',
};

const normalizePage = (rawValue) => {
	const parsed = Number(rawValue || '1');
	if (!Number.isFinite(parsed) || parsed <= 0) return 1;
	return parsed;
};

const getInitialFiltersFromSearchParams = (searchParams) => {
	return {
		...DEFAULT_POST_FILTERS,
		areaKeyword: (searchParams.get(HOME_FILTER_QUERY_KEYS.areaKeyword) || '').trim(),
		propertyType: searchParams.get(HOME_FILTER_QUERY_KEYS.propertyType) || '',
		listingType: searchParams.get(HOME_FILTER_QUERY_KEYS.listingType) || '',
		priceRange: searchParams.get(HOME_FILTER_QUERY_KEYS.priceRange) || '',
		areaRange: searchParams.get(HOME_FILTER_QUERY_KEYS.areaRange) || '',
		legalStatus: searchParams.get(HOME_FILTER_QUERY_KEYS.legalStatus) || '',
		bedrooms: searchParams.get(HOME_FILTER_QUERY_KEYS.bedrooms) || '',
		bathrooms: searchParams.get(HOME_FILTER_QUERY_KEYS.bathrooms) || '',
	};
};

// Trang chu AllPostPage: lay danh sach bai dang va phan trang giong News.
const Home = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const initialPage = normalizePage(searchParams.get('page'));
	const initialKeyword = (searchParams.get('keyword') || '').trim();
	const initialFilters = getInitialFiltersFromSearchParams(searchParams);
	const [page, setPage] = useState(initialPage);
	const [items, setItems] = useState([]);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [searchInput, setSearchInput] = useState(initialKeyword);
	const [appliedKeyword, setAppliedKeyword] = useState(initialKeyword);
	const [draftFilters, setDraftFilters] = useState(initialFilters);
	const [appliedFilters, setAppliedFilters] = useState(initialFilters);

	const syncHomeQuery = useCallback((nextState) => {
		const nextPage = normalizePage(nextState.page);
		const nextKeyword = (nextState.keyword || '').trim();
		const nextFilters = {
			...DEFAULT_POST_FILTERS,
			...(nextState.filters || {}),
		};

		setSearchParams((previousParams) => {
			const nextParams = new URLSearchParams(previousParams);
			if (nextPage <= 1) {
				nextParams.delete('page');
			} else {
				nextParams.set('page', String(nextPage));
			}

			if (nextKeyword) {
				nextParams.set('keyword', nextKeyword);
			} else {
				nextParams.delete('keyword');
			}

			Object.entries(HOME_FILTER_QUERY_KEYS).forEach(([field, queryKey]) => {
				const value = String(nextFilters[field] || '').trim();
				if (value) {
					nextParams.set(queryKey, value);
				} else {
					nextParams.delete(queryKey);
				}
			});

			return nextParams;
		});
	}, [setSearchParams]);

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
				const currentPage = result.currentPage || page;

				setItems(data);
				setTotalPages(result.totalPages || 1);
				if (currentPage !== page) {
					setPage(currentPage);
					syncHomeQuery({
						page: currentPage,
						keyword: appliedKeyword,
						filters: appliedFilters,
					});
				}

				logHome('Fetch posts success', {
					queryParams,
					page: currentPage,
					totalPages: result.totalPages || 1,
					items: data.length,
				});
			} catch (fetchError) {
				setItems([]);
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
	}, [page, queryParams, appliedKeyword, appliedFilters, syncHomeQuery]);

	const handlePrev = () => {
		if (page <= 1 || loading) return;
		const nextPage = page - 1;
		setPage(nextPage);
		syncHomeQuery({ page: nextPage, keyword: appliedKeyword, filters: appliedFilters });
	};

	const handleNext = () => {
		if (page >= totalPages || loading) return;
		const nextPage = page + 1;
		setPage(nextPage);
		syncHomeQuery({ page: nextPage, keyword: appliedKeyword, filters: appliedFilters });
	};

	const handleSearch = () => {
		const normalizedKeyword = searchInput.trim();
		setPage(1);
		setAppliedKeyword(normalizedKeyword);
		syncHomeQuery({ page: 1, keyword: normalizedKeyword, filters: appliedFilters });
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
		syncHomeQuery({ page: 1, keyword: appliedKeyword, filters: draftFilters });
		logHome('Apply backend filters', draftFilters);
	};

	const handleResetFilters = () => {
		setPage(1);
		setDraftFilters(DEFAULT_POST_FILTERS);
		setAppliedFilters(DEFAULT_POST_FILTERS);
		setSearchInput('');
		setAppliedKeyword('');
		syncHomeQuery({ page: 1, keyword: '', filters: DEFAULT_POST_FILTERS });
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
