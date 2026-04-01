import NewsCard from './NewsCard';
import EmptyState from '../../common/EmptyState';

// Luoi bai viet cho danh sach tin tuc.
const NewsGrid = ({ items, loading }) => {
	if (loading) {
		return (
			<section className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, index) => (
					<div key={index} className="animate-pulse">
						<div className="mb-6 aspect-[4/3] rounded-sm bg-[#e4e2e3]" />
						<div className="space-y-3 px-2">
							<div className="h-6 w-11/12 rounded bg-[#e4e2e3]" />
							<div className="h-4 w-full rounded bg-[#f0eef0]" />
							<div className="h-4 w-10/12 rounded bg-[#f0eef0]" />
						</div>
					</div>
				))}
			</section>
		);
	}

	if (!items.length) {
		return <EmptyState message="Không tìm thấy bài viết phù hợp." />;
	}

	return (
		<section className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
			{items.map((item) => (
				<NewsCard key={item.id} item={item} />
			))}
		</section>
	);
};

export default NewsGrid;
