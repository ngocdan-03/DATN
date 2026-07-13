export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    loading = false,
    onPrev,
    onNext
}) {

	const isFirstPage = currentPage <= 1;
	const isLastPage = currentPage >= totalPages;


	const arrowButtonClass =
		'flex h-12 w-12 items-center justify-center rounded-full border border-[#041627] bg-[#041627] text-white text-xl font-bold transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:border-[#c4c6cd] disabled:bg-[#f5f3f4] disabled:text-[#74777d] disabled:hover:scale-100';

	return (
		<footer className="mb-12 mt-24 flex flex-col items-center gap-6">
			<div className="flex items-center gap-2">
				
				<button
					type="button"
					onClick={onPrev}
					disabled={loading || isFirstPage}
					className={arrowButtonClass}
				>
					&lt;
				</button>

				<div className="flex items-center rounded-full bg-[#e4e2e3] px-6 py-2 text-xs font-bold uppercase tracking-widest text-[#041627]">
					Trang {currentPage} / {totalPages}
				</div>

				<button
					type="button"
					onClick={onNext}
					disabled={loading || isLastPage}
					className={arrowButtonClass}
				>
					&gt;
				</button>

			</div>
		</footer>
	);
}