import AppIcon from '../../common/AppIcon';

// O tim kiem bai viet theo tieu de va tom tat.
const NewsSearchInput = ({ value, onChange, onSearch, searching }) => {
	const handleSubmit = (event) => {
		event.preventDefault();
		onSearch();
	};

	return (
		<form className="relative w-full md:max-w-xl" onSubmit={handleSubmit}>
			<input
				type="text"
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder="Tìm theo tiêu đề hoặc tóm tắt tin tức..."
				className="w-full rounded-lg border border-[#c4c6cd] bg-white py-3 pl-4 pr-14 text-sm text-[#1b1c1d] outline-none transition-all placeholder:text-[#74777d]/70 focus:border-[#735c00] focus:ring-2 focus:ring-[#cca830]/30"
			/>
			<button
				type="submit"
				disabled={searching}
				className="absolute right-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md bg-[#041627] text-white transition-all hover:bg-[#0a2a47] disabled:cursor-not-allowed disabled:opacity-60"
				aria-label="Tìm kiếm tin tức"
				title="Tìm kiếm"
			>
				<AppIcon name="search" className="h-4.5 w-4.5" />
			</button>
		</form>
	);
};

export default NewsSearchInput;
