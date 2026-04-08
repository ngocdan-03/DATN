import { Link, useLocation } from 'react-router-dom';
import AppIcon from '../../common/AppIcon';
import { LISTING_LABELS, PROPERTY_LABELS } from '../../../constants/postFilters';

// Card hien thi thong tin mot bai dang bat dong san.
const HomePostCard = ({ item, resolveThumbnailUrl, formatPrice, formatArea }) => {
	const location = useLocation();
	const fromPath = `${location.pathname}${location.search}`;

	return (
		<article className="group overflow-hidden rounded-2xl border border-[#e6e4e6] bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#d1bf8a] hover:shadow-xl">
			<div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-[#f5f3f4]">
				<img
					alt={item.title || 'Bất động sản'}
					className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
					src={resolveThumbnailUrl(item.thumbnailUrl)}
				/>
				<span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#041627] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
					<AppIcon name="storefront" className="h-3.5 w-3.5" />
					{LISTING_LABELS[item.listingType] || 'Bài đăng'}
				</span>
				<span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#041627] backdrop-blur-sm">
					<AppIcon name="homeWork" className="h-3.5 w-3.5" />
					{PROPERTY_LABELS[item.propertyType] || 'BĐS'}
				</span>
			</div>

			<div className="space-y-3 p-1">
				<p className="inline-flex items-center gap-1 text-xs font-semibold text-[#74777d]">
					<AppIcon name="calendarMonth" className="h-4 w-4" />
					{item.displayDate || '--'}
				</p>
				<h3 className="text-2xl font-black text-[#735c00] [font-family:Noto_Serif]">{formatPrice(item.price)}</h3>
				<h4 className="text-lg font-bold leading-snug text-[#041627] transition-colors group-hover:text-[#735c00] [display:-webkit-box] [-webkit-line-clamp:2] [line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
					{item.title}
				</h4>

				<div className="flex flex-wrap items-center gap-3 border-y border-[#eceaec] py-3 text-sm text-[#555b63]">
					<span className="inline-flex items-center gap-1">
						<AppIcon name="areaGrid" className="h-4.5 w-4.5" />
						{formatArea(item.area)}
					</span>
					<span className="inline-flex items-center gap-1">
						<AppIcon name="bed" className="h-4.5 w-4.5" />
						{item.bedrooms || 0} PN
					</span>
					<span className="inline-flex items-center gap-1">
						<AppIcon name="bath" className="h-4.5 w-4.5" />
						{item.bathrooms || 0} WC
					</span>
				</div>

				<div className="flex items-center justify-between gap-2 text-sm font-semibold text-[#595f67]">
					<span className="inline-flex items-center gap-1.5">
						<AppIcon name="locationOn" className="h-4.5 w-4.5" />
						{item.wardName || '--'}
					</span>
					<Link
						to={`/posts/${item.id}`}
						state={{ from: fromPath }}
						className="inline-flex items-center gap-1 rounded-lg bg-[#f5f3f4] px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#041627] transition-colors hover:bg-[#041627] hover:text-white"
					>
						Xem chi tiết
						<AppIcon name="arrowRight" className="h-3.5 w-3.5" />
					</Link>
				</div>
			</div>
		</article>
	);
};

export default HomePostCard;
