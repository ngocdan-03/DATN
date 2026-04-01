import AppIcon from '../../../common/AppIcon';
import IconTextButton from '../../../common/IconTextButton';

const QuickFactCard = ({ label, value }) => (
	<div className="rounded-xl border border-[#eceaec] bg-[#faf9fa] px-4 py-3">
		<p className="text-[11px] font-bold uppercase tracking-wider text-[#7e848d]">{label}</p>
		<p className="mt-1 text-lg font-bold text-[#2f3742]">{value}</p>
	</div>
);

// Tong quan thong tin gia, dien tich, thong so va dia chi bai dang.
const PostOverview = ({
	post,
	isFavorite,
	onToggleFavorite,
	favoriteLoading,
	favoriteError,
	formatCurrencyVND,
	formatArea,
	safeText,
}) => {
	return (
		<section className="rounded-3xl border border-[#e4e2e3] bg-white p-6 md:p-8" data-component="PropertyOverview">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<p className="text-sm font-medium text-[#6a6f77]">Giá niêm yết</p>
					<h2 className="mt-1 text-3xl font-black text-[#735c00] [font-family:Noto_Serif] md:text-4xl">{formatCurrencyVND(post.price)}</h2>
				</div>
				<div className="ml-auto flex flex-col items-end gap-3">
					<IconTextButton
						onClick={onToggleFavorite}
						disabled={favoriteLoading}
						className={
							isFavorite
								? 'inline-flex h-11 items-center gap-2 rounded-xl border border-[#e7c86b] bg-[#fff8df] px-4 text-sm font-bold text-[#7a5d00] transition hover:bg-[#fff1c2]'
								: 'inline-flex h-11 items-center gap-2 rounded-xl border border-[#d7dce5] bg-white px-4 text-sm font-bold text-[#425066] transition hover:border-[#c6ac45]'
						}
						iconName={isFavorite ? 'bookmark' : 'bookmarkAdd'}
						iconClassName="h-5 w-5"
					>
						{favoriteLoading ? 'Đang xử lý...' : isFavorite ? 'Đã lưu' : 'Lưu bài đăng'}
					</IconTextButton>
					{favoriteError && <p className="max-w-[220px] text-right text-xs text-[#ba1a1a]">{favoriteError}</p>}
					<div className="rounded-xl border border-[#e7dcc0] bg-[#fff8ea] px-4 py-3 text-right">
						<p className="text-xs font-semibold uppercase tracking-wider text-[#7a6331]">Diện tích</p>
						<p className="mt-1 text-xl font-bold text-[#4f3e00]">{formatArea(post.area)}</p>
					</div>
				</div>
			</div>

			<div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
				<QuickFactCard label="Phòng ngủ" value={post.bedrooms || 0} />
				<QuickFactCard label="Phòng tắm" value={post.bathrooms || 0} />
				<QuickFactCard label="Mã bài đăng" value={`#${post.id}`} />
			</div>

			<div className="mt-6 rounded-2xl border border-[#eceaec] bg-[#faf9fa] px-4 py-4 text-sm text-[#525862]">
				<p className="flex items-start gap-2">
					<AppIcon name="locationOn" className="mt-0.5 h-[18px] w-[18px] text-[#735c00]" />
					<span>
						{safeText(post.streetAddress, 'Đang cập nhật')}, {safeText(post.wardName, 'Đang cập nhật')}
					</span>
				</p>
			</div>
		</section>
	);
};

export default PostOverview;
