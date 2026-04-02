import AppIcon from '../../common/AppIcon';
import { resolveUserAvatarUrl } from '../../../utils/avatar';

const PaymentReceiverInfo = ({ user }) => {
	const fullName = user?.fullName || user?.name || 'Nguoi dung RecoLand';
	const email = user?.email || 'Chua cap nhat';
	const phone = user?.phone || 'Chua cap nhat';
	const avatarUrl = resolveUserAvatarUrl(user?.avatarUrl || user?.avatar || 'default.png');
	const fallbackAvatarUrl = resolveUserAvatarUrl('default.png');

	return (
		<div>
			<div className="mb-6 flex items-center justify-between gap-4">
				<h3 className="text-2xl [font-family:Noto_Serif]">Thong tin nguoi thanh toan</h3>
			</div>

			<div className="rounded-2xl border border-[#cfe2fa] bg-[#f8fbff] p-5 md:p-6">
				<div className="flex items-center gap-4 border-b border-[#d9e8fb] pb-5">
					<img
						alt={fullName}
						className="h-16 w-16 rounded-2xl border border-[#c5daf5] object-cover"
						src={avatarUrl}
						onError={(event) => {
							event.currentTarget.onerror = null;
							event.currentTarget.src = fallbackAvatarUrl;
						}}
					/>
					<div>
						<p className="text-xl font-bold text-[#0b1730]">{fullName}</p>
					</div>
				</div>

				<div className="mt-5 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
					<div className="rounded-xl border border-[#d6e6fb] bg-white px-4 py-3">
						<p className="inline-flex items-center gap-1 text-xs text-[#5d6678]">
							<AppIcon name="call" className="h-3.5 w-3.5" />
							So dien thoai
						</p>
						<p className="mt-1 font-semibold text-[#0b1730]">{phone}</p>
					</div>
					<div className="rounded-xl border border-[#d6e6fb] bg-white px-4 py-3">
						<p className="inline-flex items-center gap-1 text-xs text-[#5d6678]">
							<AppIcon name="mail" className="h-3.5 w-3.5" />
							Email
						</p>
						<p className="mt-1 font-semibold text-[#0b1730]">{email}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PaymentReceiverInfo;
