import AppIcon from '../../common/AppIcon';

// Thanh thong ke tong quan ket qua tren trang Home.
const HomeResultsSummary = ({ visibleCount, pageSize, totalElements }) => {
	return (
		<div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e4e2e3] bg-white px-5 py-4 shadow-sm">
			<p className="inline-flex items-center gap-2 text-sm font-semibold text-[#041627]">
				<AppIcon name="menuRows" className="h-4.5 w-4.5 text-[#735c00]" />
				Danh sách bất động sản nổi bật
			</p>
			<div className="inline-flex items-center gap-2 rounded-full bg-[#f5f3f4] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#5e6570]">
				<AppIcon name="clock" className="h-3.5 w-3.5" />
				{visibleCount} / {pageSize} bài đăng trên trang này • Tổng: {totalElements} bài đăng
			</div>
		</div>
	);
};

export default HomeResultsSummary;
