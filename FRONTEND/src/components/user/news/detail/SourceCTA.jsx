import AppIcon from '../../../common/AppIcon';

// CTA dieu huong nguoi doc den bai viet goc.
const SourceCTA = ({ sourceName, originalUrl }) => {
	if (!originalUrl) return null;

	return (
		<section className="relative mt-20 overflow-hidden rounded-2xl border border-[#c4c6cd]/25 bg-[#f5f3f4] p-8 md:p-12">
			<div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
				<div className="max-w-md">
					<h3 className="mb-2 text-2xl font-bold text-[#041627] [font-family:Noto_Serif]">Tiếp tục hành trình khám phá</h3>
					<p className="text-[#44474c]">
						Để đọc toàn bộ phân tích chi tiết và số liệu thị trường, vui lòng truy cập bài viết gốc.
					</p>
				</div>
				<a
					href={originalUrl}
					target="_blank"
					rel="noreferrer"
					className="group inline-flex items-center gap-3 whitespace-nowrap rounded-xl bg-[#cca830] px-8 py-4 font-bold text-[#4f3e00] transition-all hover:-translate-y-1 hover:shadow-lg active:scale-95"
				>
					Xem bài viết gốc tại {sourceName || 'nguồn tin'}
					<AppIcon name="externalLink" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
				</a>
			</div>
			<div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#735c00]/5 blur-3xl"></div>
		</section>
	);
};

export default SourceCTA;
