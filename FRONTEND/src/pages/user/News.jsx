import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EditorialHeader from '../../components/user/news/EditorialHeader';
import NewsGrid from '../../components/user/news/NewsGrid';
import NewsPagination from '../../components/user/news/NewsPagination';
import NewsToolbar from '../../components/user/news/NewsToolbar';
import StateCard from '../../components/common/StateCard';
import { getAllNews } from '../../services/newsService';
import { createLogger } from '../../utils/logger';

const NEWS_PAGE_SIZE = 6;
const logNewsPage = createLogger('News');

const normalizePage = (rawValue) => {
	const parsed = Number(rawValue || '1');
	if (!Number.isFinite(parsed) || parsed <= 0) return 1;
	return parsed;
};

const normalizeCategory = (rawValue) => (rawValue || '').trim().toUpperCase();

// Trang News: goi API theo page, xu ly tim kiem/sap xep va render cac component con.
const News = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const initialPage = normalizePage(searchParams.get('page'));
	const initialKeyword = (searchParams.get('keyword') || '').trim();
	const initialCategory = normalizeCategory(searchParams.get('category'));
	const [page, setPage] = useState(initialPage);
	const [keywordInput, setKeywordInput] = useState(initialKeyword);
	const [categoryInput, setCategoryInput] = useState(initialCategory);
	const [searchKeyword, setSearchKeyword] = useState(initialKeyword);
	const [searchCategory, setSearchCategory] = useState(initialCategory);
	const [items, setItems] = useState([]);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const syncNewsQuery = useCallback((nextState) => {
		const nextPage = normalizePage(nextState.page);
		const nextKeyword = (nextState.keyword || '').trim();
		const nextCategory = normalizeCategory(nextState.category);

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

			if (nextCategory) {
				nextParams.set('category', nextCategory);
			} else {
				nextParams.delete('category');
			}

			return nextParams;
		});
	}, [setSearchParams]);

	useEffect(() => {
		const fetchNews = async () => {
			setLoading(true);
			setError('');
			logNewsPage('Fetch page start', {
				page,
				size: NEWS_PAGE_SIZE,
				keyword: searchKeyword,
				category: searchCategory,
			});

			try {
				const response = await getAllNews({
					page,
					size: NEWS_PAGE_SIZE,
					keyword: searchKeyword,
					category: searchCategory,
				});
				const result = response.data?.result || {};
				const data = Array.isArray(result.data) ? result.data : [];
				const currentPage = result.currentPage || page;

				setItems(data);
				setTotalPages(result.totalPages || 1);
				if (currentPage !== page) {
					setPage(currentPage);
					syncNewsQuery({
						page: currentPage,
						keyword: searchKeyword,
						category: searchCategory,
					});
				}

				logNewsPage('Fetch page success', {
					keyword: searchKeyword,
					category: searchCategory,
					page: currentPage,
					totalPages: result.totalPages || 1,
					items: data.length,
				});
			} catch (fetchError) {
				setItems([]);
				setError(fetchError.response?.data?.message || 'Không thể tải danh sách tin tức.');
				logNewsPage('Fetch page failed', {
					httpStatus: fetchError.response?.status,
					code: fetchError.response?.data?.code,
					message: fetchError.response?.data?.message || fetchError.message,
					keyword: searchKeyword,
					category: searchCategory,
				});
			} finally {
				setLoading(false);
			}
		};

		fetchNews();
	}, [page, searchKeyword, searchCategory, syncNewsQuery]);

	const handleSearch = () => {
		const normalizedKeyword = keywordInput.trim();
		const normalizedCategory = normalizeCategory(categoryInput);
		logNewsPage('Trigger search', { keyword: normalizedKeyword, category: normalizedCategory });
		setPage(1);
		setSearchKeyword(normalizedKeyword);
		setSearchCategory(normalizedCategory);
		syncNewsQuery({ page: 1, keyword: normalizedKeyword, category: normalizedCategory });
	};

	const handleCategoryChange = (value) => {
		const normalizedCategory = normalizeCategory(value);
		logNewsPage('Category changed', { category: normalizedCategory });
		setCategoryInput(normalizedCategory);
		setPage(1);
		setSearchCategory(normalizedCategory);
		syncNewsQuery({ page: 1, keyword: searchKeyword, category: normalizedCategory });
	};

	const handlePrev = () => {
		if (page <= 1 || loading) return;
		const nextPage = page - 1;
		logNewsPage('Go to previous page', { from: page, to: nextPage });
		setPage(nextPage);
		syncNewsQuery({ page: nextPage, keyword: searchKeyword, category: searchCategory });
	};

	const handleNext = () => {
		if (page >= totalPages || loading) return;
		const nextPage = page + 1;
		logNewsPage('Go to next page', { from: page, to: nextPage });
		setPage(nextPage);
		syncNewsQuery({ page: nextPage, keyword: searchKeyword, category: searchCategory });
	};

	return (
		<main className="mx-auto max-w-[1536px] px-8 py-12">
			<EditorialHeader />

			<NewsToolbar
				keyword={keywordInput}
				onKeywordChange={setKeywordInput}
				category={categoryInput}
				onCategoryChange={handleCategoryChange}
				onSearch={handleSearch}
				searching={loading}
			/>

			{error && <StateCard variant="error" title="Không tải được tin tức" message={error} className="mb-8 p-4" />}

			<NewsGrid items={items} loading={loading} />

			<NewsPagination
				currentPage={page}
				totalPages={totalPages}
				loading={loading}
				onPrev={handlePrev}
				onNext={handleNext}
			/>
		</main>
	);
};

export default News;
