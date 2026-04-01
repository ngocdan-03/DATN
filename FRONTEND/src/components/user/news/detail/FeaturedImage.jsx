const BACKEND_ORIGIN = 'http://localhost:8080';
const FALLBACK_THUMBNAIL =
	'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=80';
const LOCAL_NEWS_IMAGES = import.meta.glob('../../../../assets/news/*.{png,jpg,jpeg,webp,avif}', {
	eager: true,
	import: 'default',
});

const LOCAL_NEWS_IMAGE_BY_NAME = Object.entries(LOCAL_NEWS_IMAGES).reduce((accumulator, [path, assetUrl]) => {
	const fileName = path.split('/').pop()?.toLowerCase();
	if (fileName) accumulator[fileName] = assetUrl;
	return accumulator;
}, {});

const resolveThumbnailUrl = (url) => {
	if (!url) return FALLBACK_THUMBNAIL;
	if (url.startsWith('http://') || url.startsWith('https://')) return url;

	const fileName = url.split('?')[0].split('#')[0].split('/').pop()?.toLowerCase();
	if (fileName && LOCAL_NEWS_IMAGE_BY_NAME[fileName]) return LOCAL_NEWS_IMAGE_BY_NAME[fileName];
	if (url.startsWith('/')) return `${BACKEND_ORIGIN}${url}`;
	return FALLBACK_THUMBNAIL;
};

// Anh noi bat cua bai viet.
const FeaturedImage = ({ thumbnailUrl, title }) => {
	return (
		<section className="group relative mb-12">
			<div className="aspect-video overflow-hidden rounded-2xl bg-[#efedef] shadow-2xl">
				<img
					alt={title || 'Ảnh nổi bật tin tức'}
					className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
					src={resolveThumbnailUrl(thumbnailUrl)}
				/>
			</div>
			<p className="mt-4 text-center text-sm italic text-[#44474c]">Hình ảnh minh họa cho nội dung bài viết.</p>
		</section>
	);
};

export default FeaturedImage;
