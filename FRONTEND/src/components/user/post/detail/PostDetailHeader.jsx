import AppIcon from '../../../common/AppIcon';
import BackLink from '../../news/detail/BackLink';

const MetaTag = ({ label, iconName, className }) => (
	<span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${className}`}>
		<AppIcon name={iconName} className="h-4 w-4" />
		{label}
	</span>
);

// Header thong tin bai dang: quay lai, ngay dang, tieu de va nhom tag.
const PostDetailHeader = ({ title, displayDate, listingTypeLabel, propertyTypeLabel, legalStatusLabel, backTo = -1 }) => {
	return (
		<section className="mb-8" data-component="DetailHeader">
			<div className="mb-3">
				<BackLink
					to={backTo}
					withWrapper={false}
					className="group inline-flex items-center gap-2 text-sm font-semibold text-[#44474c] transition-colors hover:text-[#041627]"
				/>
			</div>

			<div className="flex flex-wrap items-center justify-between gap-3">
				<p className="inline-flex items-center gap-2 rounded-full border border-[#d6d9df] bg-white px-4 py-1.5 text-xs font-semibold text-[#4a5059]">
					<AppIcon name="calendarMonth" className="h-4 w-4" />
					<span>{displayDate}</span>
				</p>
			</div>

			<h1 className="mt-4 max-w-4xl text-3xl font-black leading-tight text-[#041627] [font-family:Noto_Serif] md:text-5xl">
				{title}
			</h1>

			<div className="mt-5 flex flex-wrap items-center gap-2">
				<MetaTag label={listingTypeLabel} iconName="storefront" className="border-[#b9e2c9] bg-[#eaf5ee] text-[#206a3c]" />
				<MetaTag label={propertyTypeLabel} iconName="homeWork" className="border-[#dce0e7] bg-white text-[#2b3340]" />
				<MetaTag label={legalStatusLabel} iconName="gavel" className="border-[#e5d8b8] bg-[#fff8ea] text-[#6a540a]" />
			</div>
		</section>
	);
};

export default PostDetailHeader;
