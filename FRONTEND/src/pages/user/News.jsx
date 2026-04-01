import { useEffect, useState } from 'react';
import EditorialHeader from '../../components/user/news/EditorialHeader';
import NewsGrid from '../../components/user/news/NewsGrid';
import NewsPagination from '../../components/user/news/NewsPagination';
import NewsToolbar from '../../components/user/news/NewsToolbar';
import { getAllNews } from '../../services/newsService';
import { createLogger } from '../../utils/logger';

const NEWS_PAGE_SIZE = 6;
const logNewsPage = createLogger('News');

// Trang News: goi API theo page, xu ly tim kiem/sap xep va render cac component con.
const News = () => {
	const [page, setPage] = useState(1);
	const [keywordInput, setKeywordInput] = useState('');
	const [categoryInput, setCategoryInput] = useState('');
	const [searchKeyword, setSearchKeyword] = useState('');
	const [searchCategory, setSearchCategory] = useState('');
	const [items, setItems] = useState([]);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

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

				setItems(data);
				setTotalPages(result.totalPages || 1);

				logNewsPage('Fetch page success', {
					keyword: searchKeyword,
					category: searchCategory,
					page: result.currentPage || page,
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
	}, [page, searchKeyword, searchCategory]);

	const handleSearch = () => {
		const normalizedKeyword = keywordInput.trim();
		const normalizedCategory = categoryInput.trim().toUpperCase();
		logNewsPage('Trigger search', { keyword: normalizedKeyword, category: normalizedCategory });
		setPage(1);
		setSearchKeyword(normalizedKeyword);
		setSearchCategory(normalizedCategory);
	};

	const handleCategoryChange = (value) => {
		const normalizedCategory = value.trim().toUpperCase();
		logNewsPage('Category changed', { category: normalizedCategory });
		setCategoryInput(normalizedCategory);
		setPage(1);
		setSearchCategory(normalizedCategory);
	};

	const handlePrev = () => {
		if (page <= 1 || loading) return;
		const nextPage = page - 1;
		logNewsPage('Go to previous page', { from: page, to: nextPage });
		setPage(nextPage);
	};

	const handleNext = () => {
		if (page >= totalPages || loading) return;
		const nextPage = page + 1;
		logNewsPage('Go to next page', { from: page, to: nextPage });
		setPage(nextPage);
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

			{error && <p className="mb-8 rounded-lg bg-[#ffdad6] px-4 py-3 text-sm text-[#ba1a1a]">{error}</p>}

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
