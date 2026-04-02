import AppIcon from '../../common/AppIcon';

const PaymentSummary = ({ selectedPackage, creatingPayment, onCreatePayment }) => {
	return (
		<aside className="h-fit rounded-3xl border border-[#d8e9ff] bg-white p-5 shadow-[0_18px_44px_-30px_rgba(0,75,146,0.45)] md:p-7">
			<div className="mb-5 flex items-start justify-between">
				<h2 className="text-3xl [font-family:Noto_Serif]">Tom tat don</h2>
				<span className="rounded-full bg-[#eef6ff] p-2 text-[#005baa]">
					<AppIcon name="article" className="h-5 w-5" />
				</span>
			</div>

			<div className="space-y-4 rounded-2xl border border-[#dbe9fb] bg-[#f8fbff] p-4">
				<div className="flex items-center justify-between">
					<span className="text-sm text-[#5d6678]">Goi da chon</span>
					<strong className="text-sm text-[#0b1730]">{selectedPackage?.label || '--'}</strong>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-sm text-[#5d6678]">Tam tinh</span>
					<strong className="text-sm text-[#0b1730]">{selectedPackage?.formattedAmount || '0 VND'}</strong>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-sm text-[#5d6678]">Phi cong thanh toan</span>
					<strong className="text-sm text-[#0b1730]">0 VND</strong>
				</div>
				<hr className="border-[#d3e4f8]" />
				<div className="flex items-center justify-between">
					<span className="font-semibold text-[#0b1730]">Tong thanh toan</span>
					<strong className="text-2xl text-[#005baa]">{selectedPackage?.formattedAmount || '0 VND'}</strong>
				</div>
			</div>

			<button
				type="button"
				onClick={onCreatePayment}
				disabled={creatingPayment}
				className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(120deg,_#005baa,_#00a9e0)] px-5 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_35px_-22px_rgba(0,91,170,0.75)] disabled:cursor-not-allowed disabled:opacity-70"
			>
				<AppIcon name="arrowRight" className="h-4 w-4" />
				{creatingPayment ? 'Dang tao URL...' : 'Thanh toan qua VNPay'}
			</button>

			<p className="mt-4 text-center text-xs leading-relaxed text-[#5d6678]">
				Bam nut thanh toan, ban dong y voi dieu khoan giao dich va chinh sach bao mat cua VNPay.
			</p>
		</aside>
	);
};

export default PaymentSummary;
