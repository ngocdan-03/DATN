import { forwardRef } from "react";

const SearchInput = forwardRef(({ onSearch }, ref) => {

	const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(ref.current.value);
	};

	return (
		<form className="relative w-full md:max-w-xl" onSubmit={handleSubmit}>
			<input
				type="text"
				ref={ref}
				placeholder="Tìm theo tiêu đề"
				className="w-full rounded-lg border border-[#c4c6cd] bg-white py-3 pl-4 pr-14 text-sm text-[#1b1c1d] outline-none transition-all placeholder:text-[#74777d]/70 focus:border-[#735c00] focus:ring-2 focus:ring-[#cca830]/30"
			/>

			<button
				type="submit"
				className="absolute right-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md bg-[#041627] text-white transition-all hover:bg-[#0a2a47] disabled:cursor-not-allowed disabled:opacity-60"
				aria-label="Tìm kiếm tin tức"
				title="Tìm kiếm"
			>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="16.65" y1="16.65" x2="21" y2="21" />
                </svg>
			</button>
		</form>
	);
});

export default SearchInput;