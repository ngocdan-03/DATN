import AppIcon from '../../common/AppIcon';

// Cum dieu huong phan trang, moi lan doi trang se trigger goi API trang moi.
const NewsPagination = ({ currentPage, totalPages, loading, onPrev, onNext }) => {
	const isFirstPage = currentPage <= 1;
	const isLastPage = currentPage >= totalPages;
	const arrowButtonClass =
		'flex h-12 w-12 items-center justify-center rounded-full border border-[#041627] bg-[#041627] text-white transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:border-[#c4c6cd] disabled:bg-[#f5f3f4] disabled:text-[#74777d] disabled:hover:scale-100';

	return (
		<footer className="mb-12 mt-24 flex flex-col items-center gap-6">
			<div className="flex items-center gap-2">
				<button
					type="button"
					aria-label="Previous page"
					onClick={onPrev}
					disabled={loading || isFirstPage}
					className={arrowButtonClass}
				>
					<AppIcon name="chevronLeft" className="h-5 w-5" strokeWidth={2.5} />
				</button>
				<div className="flex items-center rounded-full bg-[#e4e2e3] px-6 py-2 text-xs font-bold uppercase tracking-widest text-[#041627]">
					Trang {currentPage} / {totalPages || 1}
				</div>
				<button
					type="button"
					aria-label="Next page"
					onClick={onNext}
					disabled={loading || isLastPage || totalPages === 0}
					className={arrowButtonClass}
				>
					<AppIcon name="chevronRight" className="h-5 w-5" strokeWidth={2.5} />
				</button>
			</div>
		</footer>
	);
};

export default NewsPagination;
