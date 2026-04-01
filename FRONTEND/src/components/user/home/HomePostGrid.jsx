import HomePostCard from './HomePostCard';
import EmptyState from '../../common/EmptyState';

// Luoi bai dang trang Home, gom loading/empty/content state.
const HomePostGrid = ({ items, loading, pageSize, resolveThumbnailUrl, formatPrice, formatArea }) => {
	if (loading) {
		return (
			<section className="grid grid-cols-1 gap-x-7 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: pageSize }).map((_, index) => (
					<div key={index} className="animate-pulse overflow-hidden rounded-2xl border border-[#e6e4e6] bg-white p-3">
						<div className="mb-4 aspect-[4/3] rounded-xl bg-[#efedee]" />
						<div className="space-y-3 p-1">
							<div className="h-4 w-1/3 rounded bg-[#efedee]" />
							<div className="h-7 w-1/2 rounded bg-[#e8e4e6]" />
							<div className="h-6 w-full rounded bg-[#efedee]" />
							<div className="h-10 w-full rounded bg-[#f4f2f3]" />
						</div>
					</div>
				))}
			</section>
		);
	}

	if (!items.length) {
		return <EmptyState message="Không tìm thấy bài đăng phù hợp." />;
	}

	return (
		<section className="grid grid-cols-1 gap-x-7 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
			{items.map((item) => (
				<HomePostCard
					key={item.id}
					item={item}
					resolveThumbnailUrl={resolveThumbnailUrl}
					formatPrice={formatPrice}
					formatArea={formatArea}
				/>
			))}
		</section>
	);
};

export default HomePostGrid;
