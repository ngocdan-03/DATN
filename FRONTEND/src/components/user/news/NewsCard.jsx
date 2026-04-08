import { Link, useLocation } from 'react-router-dom';
import AppIcon from '../../common/AppIcon';

const BACKEND_ORIGIN = 'http://localhost:8080';
const FALLBACK_THUMBNAIL =
	'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';
const LOCAL_NEWS_IMAGES = import.meta.glob('../../../assets/news/*.{png,jpg,jpeg,webp,avif}', {
	eager: true,
	import: 'default',
});

const LOCAL_NEWS_IMAGE_BY_NAME = Object.entries(LOCAL_NEWS_IMAGES).reduce((accumulator, [path, assetUrl]) => {
	const fileName = path.split('/').pop()?.toLowerCase();
	if (fileName) {
		accumulator[fileName] = assetUrl;
	}
	return accumulator;
}, {});

const getFileNameFromPath = (pathValue) => {
	if (!pathValue) return '';
	const cleanPath = pathValue.split('?')[0].split('#')[0];
	return cleanPath.split('/').pop()?.toLowerCase() || '';
};

const resolveThumbnailUrl = (url) => {
	if (!url) return FALLBACK_THUMBNAIL;
	if (url.startsWith('http://') || url.startsWith('https://')) return url;

	const fileName = getFileNameFromPath(url);
	if (fileName && LOCAL_NEWS_IMAGE_BY_NAME[fileName]) {
		return LOCAL_NEWS_IMAGE_BY_NAME[fileName];
	}

	if (url.startsWith('/')) {
		return `${BACKEND_ORIGIN}${url}`;
	}

	return FALLBACK_THUMBNAIL;
};

const CATEGORY_LABELS = {
	MARKET: 'Thị trường',
	GUIDE: 'Cẩm nang',
	PROJECT: 'Dự án',
	LAW: 'Pháp lý',
};

// Card hien thi thong tin tung bai viet tin tuc.
const NewsCard = ({ item }) => {
	const location = useLocation();
	const category = CATEGORY_LABELS[item?.category] || 'Tin tức';
	const detailPath = `/news/${item?.id}`;
	const fromPath = `${location.pathname}${location.search}`;

	return (
		<article className="group">
			<Link
				to={detailPath}
				state={{ from: fromPath }}
				className="block relative mb-6 aspect-[4/3] overflow-hidden rounded-sm bg-[#f5f3f4]"
			>
				<img
					alt={item?.title || 'News thumbnail'}
					className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
					src={resolveThumbnailUrl(item?.thumbnailUrl)}
				/>
				<div className="absolute left-4 top-4 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#041627] backdrop-blur-sm">
					{category}
				</div>
			</Link>
			<div className="px-2">
				<h3 className="mb-3 text-xl leading-tight text-[#041627] transition-colors [font-family:Noto_Serif] group-hover:text-[#735c00]">
					<Link to={detailPath} state={{ from: fromPath }} className="hover:underline decoration-[#735c00]/50 underline-offset-4">
						{item?.title}
					</Link>
				</h3>
				<div className="mt-6 flex items-center justify-between border-t border-[#c4c6cd]/10 pt-4">
					<span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#44474c]">
						<AppIcon name="mail" className="h-3.5 w-3.5" />
						{item?.sourceName || 'Tin tức RecoLand'}
					</span>
					<span className="inline-flex items-center gap-1 text-[10px] text-[#44474c]/60">
						<AppIcon name="calendarMonth" className="h-3.5 w-3.5" />
						{item?.displayDate || ''}
					</span>
				</div>
			</div>
		</article>
	);
};

export default NewsCard;
