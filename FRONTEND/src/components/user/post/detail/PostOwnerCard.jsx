import AppIcon from '../../../common/AppIcon';

// The lien he nguoi dang voi thong tin co ban va CTA lien he.
const PostOwnerCard = ({
	owner,
	ownerAvatar,
	ownerPhone,
	ownerEmail,
	contactEmailHref,
	onContactZalo,
	onContactEmail,
	safeText,
}) => {
	return (
		<aside className="space-y-5" data-component="OwnerCard">
			<section className="sticky top-6 rounded-3xl border border-[#e4e2e3] bg-white p-6 shadow-[0_22px_40px_-35px_rgba(4,22,39,0.45)]">
				<div className="flex items-center gap-3">
					<img alt="Avatar chủ đăng" className="h-20 w-20 rounded-2xl border border-[#e6e3dc] object-cover" src={ownerAvatar} />
					<div>
						<p className="text-xs uppercase tracking-[0.16em] text-[#8b9098]">Người đăng</p>
						<h4 className="mt-0.5 text-xl font-extrabold text-[#041627]">{safeText(owner?.fullName, 'Chưa có tên')}</h4>
					</div>
				</div>

				<div className="mt-5 space-y-3 text-sm text-[#39414a]">
					<p className="flex items-center gap-2">
						<AppIcon name="call" className="h-[19px] w-[19px] text-[#735c00]" />
						<span>{safeText(owner?.phone, 'Chưa có số điện thoại')}</span>
					</p>
					<p className="flex items-center gap-2 break-all">
						<AppIcon name="mail" className="h-[19px] w-[19px] text-[#735c00]" />
						<span>{safeText(owner?.email, 'Chưa có email')}</span>
					</p>
				</div>

				<div className="mt-6 grid grid-cols-1 gap-3">
					<a
						className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#041627] px-4 text-sm font-bold text-white transition hover:bg-[#0b2c49] ${
							ownerPhone ? '' : 'pointer-events-none opacity-60'
						}`}
						href={ownerPhone ? `https://zalo.me/${ownerPhone}` : '#'}
						onClick={(event) => {
							event.preventDefault();
							onContactZalo?.();
						}}
					>
						<AppIcon name="call" />
						Liên hệ Zalo
					</a>
					<a
						className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#d7dce5] bg-white px-4 text-sm font-bold text-[#041627] transition hover:border-[#041627] ${
							ownerEmail ? '' : 'pointer-events-none opacity-60'
						}`}
						href={contactEmailHref}
						onClick={(event) => {
							event.preventDefault();
							onContactEmail?.();
						}}
					>
						<AppIcon name="chat" />
						Liên hệ email
					</a>
				</div>
			</section>
		</aside>
	);
};

export default PostOwnerCard;
