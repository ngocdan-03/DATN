import AppIcon from '../../../common/AppIcon';

const CATEGORY_LABELS = {
	MARKET: 'Thị trường',
	GUIDE: 'Cẩm nang',
	PROJECT: 'Dự án',
	LAW: 'Pháp lý',
};

// Header thong tin chinh cua bai viet.
const DetailHero = ({ category, title, sourceName, displayDate }) => {
	const categoryLabel = CATEGORY_LABELS[category] || 'Tin tức';

	return (
		<header className="mb-12">
			<div className="mb-6 inline-block bg-[#cca830]/10 px-3 py-1">
				<span className="text-xs font-bold uppercase tracking-[0.1em] text-[#735c00]">{categoryLabel}</span>
			</div>

			<h1 className="mb-8 text-4xl font-bold leading-tight text-[#041627] [font-family:Noto_Serif] md:text-5xl">
				{title}
			</h1>

			<div className="flex flex-wrap items-center gap-6 text-[#44474c]">
				<div className="flex items-center gap-2">
					<AppIcon name="mail" className="h-4 w-4 text-[#735c00]" />
					<span className="font-medium">{sourceName || 'Tin tức RecoLand'}</span>
				</div>
				<div className="flex items-center gap-2">
					<AppIcon name="calendarMonth" className="h-4 w-4 text-[#735c00]" />
					<span className="font-medium">{displayDate || ''}</span>
				</div>
			</div>
		</header>
	);
};

export default DetailHero;
