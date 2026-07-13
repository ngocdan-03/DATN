import { PAYMENT_RECEIVER } from "../../../constants/payment";

export default function PaymentReceiverInfo() {
	return (
		<div>
			<div className="mb-6 flex items-center justify-between gap-4">
				<h3 className="text-2xl [font-family:Noto_Serif]">
					Thông tin người nhận
				</h3>
			</div>

			<div className="rounded-2xl border border-[#cfe2fa] bg-[#f8fbff] p-5 md:p-6">
				<div className="flex items-center gap-4 border-b border-[#d9e8fb] pb-5">
					<img
						alt={PAYMENT_RECEIVER.fullName}
						className="h-16 w-16 rounded-2xl border border-[#c5daf5] object-cover"
						src={PAYMENT_RECEIVER.avatar}
					/>
					<div>
						<p className="text-xl font-bold text-[#0b1730]">
							{PAYMENT_RECEIVER.fullName}
						</p>
					</div>
				</div>

				<div className="mt-5 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
					<div className="rounded-xl border border-[#d6e6fb] bg-white px-4 py-3">
						<p className="text-xs text-[#5d6678]">
							So dien thoai
						</p>
						<p className="mt-1 font-semibold text-[#0b1730]">
							{PAYMENT_RECEIVER.phone}
						</p>
					</div>

					<div className="rounded-xl border border-[#d6e6fb] bg-white px-4 py-3">
						<p className="text-xs text-[#5d6678]">
							Email
						</p>
						<p className="mt-1 font-semibold text-[#0b1730]">
							{PAYMENT_RECEIVER.email}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}