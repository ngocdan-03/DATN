import AppIcon from '../../common/AppIcon';

const PaymentHero = () => {
	return (
		<section className="mb-8 overflow-hidden rounded-3xl border border-[#bfdbff] bg-[linear-gradient(120deg,_rgba(0,91,170,0.95),_rgba(0,169,224,0.92))] p-6 text-white shadow-[0_20px_45px_-25px_rgba(0,61,122,0.75)] md:p-10">
			<div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
				<div className="max-w-2xl">
					<span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
						<AppIcon name="legalSeal" className="h-4 w-4" />
						Thanh toan bao mat VNPay
					</span>
					<h1 className="text-4xl leading-tight [font-family:Noto_Serif] md:text-6xl">Nang cap goi dich vu nhanh trong 30 giay</h1>
					<p className="mt-4 max-w-xl text-sm leading-relaxed text-blue-50 md:text-base">
						Chon goi phu hop va thanh toan qua cong VNPay. Giao dich ma hoa, xac nhan tu dong ngay sau khi thanh cong.
					</p>
				</div>

				<div className="rounded-2xl border border-white/30 bg-white/10 p-4 backdrop-blur-sm">
					<p className="text-xs uppercase tracking-[0.18em] text-blue-100">Phuong thuc</p>
					<p className="mt-1 text-xl font-bold">VNPay QR / ATM / Visa</p>
				</div>
			</div>
		</section>
	);
};

export default PaymentHero;
