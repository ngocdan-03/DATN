import NewsSearchInput from './NewsSearchInput';

// Thanh cong cu tim kiem tren trang tin tuc.
const CATEGORY_OPTIONS = [
	{ value: '', label: 'Tất cả chuyên mục' },
	{ value: 'MARKET', label: 'MARKET - Thị trường' },
	{ value: 'GUIDE', label: 'GUIDE - Cẩm nang' },
	{ value: 'LAW', label: 'LAW - Pháp lý' },
	{ value: 'PROJECT', label: 'PROJECT - Dự án' },
];

const NewsToolbar = ({ keyword, onKeywordChange, category, onCategoryChange, onSearch, searching }) => {
	return (
		<section className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<NewsSearchInput value={keyword} onChange={onKeywordChange} onSearch={onSearch} searching={searching} />
			<select
				value={category}
				onChange={(event) => onCategoryChange(event.target.value)}
				className="h-11 w-full rounded-lg border border-[#c4c6cd] bg-white px-3 text-sm font-semibold text-[#1b1c1d] outline-none transition-all focus:border-[#735c00] focus:ring-2 focus:ring-[#cca830]/30 md:w-[260px]"
			>
				{CATEGORY_OPTIONS.map((option) => (
					<option key={option.value || 'all-category'} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</section>
	);
};

export default NewsToolbar;
